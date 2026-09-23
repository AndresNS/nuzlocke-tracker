import * as cheerio from "cheerio";
import fs from "node:fs";
import { exit } from "node:process";

// Utils
import { cleanPercentage, formatLevels } from "./utils/helpers.js";

// Data
import routes from "./data/routes.json" with { type: "json" };

const availableMethods = {};
const METHODS = {
  grass: "grass",
  surfing: "surf",
  fishing: "fish",
  rocksmash: "rocksmash",
  gift: "gift",
  static: "interact",
  trades: "trade",
};

const TESTING = true;

if (TESTING) {
  let routeIndex = 0;
  routes.find((item, index) => {
    routeIndex = index;
    return item.id === "route119";
  });

  console.log("routeIndex", routeIndex);

  console.dir(await generateRouteObject(routes[routeIndex]), { depth: null });

  exit();
}

const OUTPUT_PATH = "./outputs";

await Promise.all(routes.map((route) => generateRouteObject(route))).then(
  (data) => {
    console.dir(data, { depth: null });

    saveFile(OUTPUT_PATH, "encounters.json", data);

    console.log("availableMethods", availableMethods);
  },
);

async function generateRouteObject(route) {
  const ENCOUNTERS_URL = `https://www.serebii.net/pokearth/hoenn/3rd/${route.id}.shtml`;

  const html = await fetchHTML(ENCOUNTERS_URL);
  const $ = cheerio.load(html);

  const encounterMethods = getRouteEncounterMethods($, route);

  const encounters = getEncounters($, encounterMethods);

  const routeObject = buildRouteObject(route, encounterMethods, encounters);

  return routeObject;
}

function getEncounters($, encounterMethods) {
  const data = {};

  let currentMethod = "";
  let prevIterationMethod = "";
  let currentGame = "";

  $("table.extradextable, table.dextable").each((_, table) => {
    const pokemonNames = [];
    const pokemonRates = [];
    const pokemonLevels = [];

    $(table)
      .find("td")
      .each((_, td) => {
        const tdClass = $(td).attr("class");

        if (tdClass === "emerald") currentGame = "emerald";

        if (encounterMethods.includes(tdClass) || tdClass === METHODS.fishing) {
          const rod =
            tdClass === METHODS.fishing
              ? `fish-${$(td).find("a").attr("name")}`
              : null;

          currentMethod = rod ?? tdClass;
          currentGame = "";
          data[currentMethod] = [];
        }

        if (tdClass === METHODS.gift) {
          const game = $(td)
            .find("a")
            .text()
            .split("-")[1]
            .trim()
            .toLowerCase();

          if (game === "emerald") currentGame = "emerald";
        }

        if (currentMethod === prevIterationMethod) {
          const isEmerald = currentGame === "emerald";

          if (!isEmerald) {
            prevIterationMethod = currentMethod;
            return;
          }
        }

        if (tdClass === "name") pokemonNames.push($(td).text());
        if (tdClass === "rate") pokemonRates.push($(td).text());
        if (tdClass === "level") pokemonLevels.push($(td).text());

        prevIterationMethod = currentMethod;
      });

    pokemonNames.forEach((_, index) => {
      if (!data[currentMethod]) data[currentMethod] = [];

      const species = pokemonNames[index].toLowerCase();
      const rate = cleanPercentage(pokemonRates[index]);
      const level = formatLevels(pokemonLevels[index]);

      let encountersObject = {};

      switch (currentMethod) {
        case METHODS.gift:
        case METHODS.static:
          encountersObject = {
            species,
            level,
          };
          break;

        default:
          encountersObject = { species, rate, level };
      }

      data[currentMethod].push(encountersObject);
    });
  });

  return data;
}

function getRouteEncounterMethods($, route) {
  const methodsTable = $("table.anctab").filter((_, element) => {
    const tds = $(element).find("td");

    const anchorTd = tds.filter(
      (_, element) => $(element).text() === "Anchors",
    );

    return anchorTd.length > 0;
  });

  const methodsClasses = Object.keys(METHODS)
    .map((key) => `td.${METHODS[key]}`)
    .join(",");

  const methodsElements = $(methodsTable).find("td");

  $(methodsElements)
    .map((_, method) => $(method).attr("class"))
    .toArray()
    .forEach((method) => {
      if (!availableMethods[method]) availableMethods[method] = [];
      availableMethods[method].push(route.id);
    });

  const filteredMethodsElements = $(methodsTable).find(methodsClasses);

  const encounterMethods = $(filteredMethodsElements)
    .map((_, method) => {
      const methodClass = $(method).attr("class");

      if (methodClass !== "fish") return methodClass;

      const rod = $(method).find("a").attr("href").replace("#", "");
      return `${methodClass}-${rod}`;
    })
    .toArray();

  return [...new Set(encounterMethods)];
}

function buildRouteObject(route, encounterMethods, encounters) {
  const areas = [];
  const trades = [];
  let gifts = [];
  const statics = [];

  encounterMethods.forEach((method) => {
    if (method === METHODS.static) return statics.push({ name: "", level: "" });

    if (method === METHODS.gift) return (gifts = encounters[method]);

    if (method === METHODS.trades)
      return trades.push({
        give: "",
        receive: [{ name: "", item: "" }],
      });

    const pokemon = encounters[method];

    return areas.push({ method, pokemon });
  });

  return {
    id: route.id,
    name: route.name,
    areas,
    trades,
    gifts,
    static: statics,
  };
}

async function fetchHTML(url) {
  const response = await fetch(url);
  const html = await response.text();

  return html;
}

function saveFile(path, filename, content) {
  fs.writeFile(
    `${path}/${filename}`,
    JSON.stringify(content, null, 2),
    (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log("File generated");
      }
    },
  );
}

// [
//   {
//     "id": "",
//     "name": "",
//     ,
//     "trades": [
//       {
//         "give": "ralts",
//         "receive": { "name": "", "item": "" }
//       }
//     ],
//     "gifts": [{ "name": "", "level": 24 }],
//     "static": [{ "name": "", "level": 14 }]
//   }
// ]
//
//
// gift: [ 'route101', 'route119', 'route119' ],
// interact: [ 'route105', 'route120', 'route111' ],
// rocksmash: [ 'route114' ]
