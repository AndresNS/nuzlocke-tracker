import * as cheerio from "cheerio";
import fs from "node:fs";
import { exit } from "node:process";

// Utils & Constants
import { cleanPercentage, formatLevels } from "./utils/helpers.js";
import { GAME, METHOD } from "./utils/constants.js";

// Data
import routes from "./data/pokemon-routes.json" with { type: "json" };

const availableMethods = {};

const TESTING = false;

if (TESTING) {
  let routeIndex = 0;
  routes.find((item, index) => {
    routeIndex = index;
    return item.id === "route114";
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

    const emptyRoutes = data.filter(
      (route) =>
        route.areas.length === 0 &&
        route.gifts.length === 0 &&
        route.static.length === 0 &&
        route.trades.length === 0,
    );

    console.log("EMPTY", emptyRoutes);

    // console.log("availableMethods", availableMethods);
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
        let tdClass = $(td).attr("class");
        if (tdClass === "swarm") tdClass = METHOD.ROCKSMASH;

        if (tdClass === GAME.EMERALD) currentGame = GAME.EMERALD;

        if (encounterMethods.includes(tdClass) || tdClass === METHOD.FISHING) {
          const rod =
            tdClass === METHOD.FISHING
              ? `fish-${$(td).find("a").attr("name")}`
              : null;

          currentMethod = rod ?? tdClass;
          currentGame = "";
          data[currentMethod] = [];
        }

        if (tdClass === METHOD.GIFT) {
          const gameRow = $(td)
            .find("a")
            .text()
            .split("-")[1]
            .trim()
            .toLowerCase();

          if (gameRow === GAME.EMERALD) currentGame = GAME.EMERALD;
        }

        if (currentMethod === prevIterationMethod) {
          const isEmerald = currentGame === GAME.EMERALD;

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
        case METHOD.GIFT:
        case METHOD.STATIC:
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

  const methodsClasses = Object.keys(METHOD)
    .map((key) => `td.${METHOD[key]}`)
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

      if (methodClass !== METHOD.FISHING) return methodClass;

      const rod = $(method).find("a").attr("href").replace("#", "");
      return `${methodClass}-${rod}`;
    })
    .toArray();

  return [...new Set(encounterMethods)];
}

function buildRouteObject(route, encounterMethods, encounters) {
  const areas = [];
  const trades = [];
  const statics = [];
  let gifts = [];

  encounterMethods.forEach((method) => {
    if (method === METHOD.STATIC) return statics.push({ name: "", level: "" });

    if (method === METHOD.GIFT) return (gifts = encounters[method]);

    if (method === METHOD.TRADE)
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

function patchEncounters() {}

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
//     "static": [{ "name": "", "level": 14 }]
//   }
// ]
//
//
// interact: [ 'route105', 'route120', 'route111' ],
