import * as cheerio from "cheerio";
import fs from "node:fs";
import { exit } from "node:process";

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
  console.dir(await generateRouteObject(routes[3]), { depth: null });

  exit();
}

const OUTPUT_PATH = "./outputs";

await Promise.all(routes.map((route) => generateRouteObject(route))).then(
  (data) => {
    console.dir(data, { depth: null });

    saveFile(OUTPUT_PATH, "encounters.json", data);
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

        if (encounterMethods.includes(tdClass) || tdClass === "fish") {
          const rod =
            tdClass === "fish" ? `fish-${$(td).find("a").attr("name")}` : null;

          currentMethod = rod ?? tdClass;
          currentGame = "";
          data[currentMethod] = [];
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

      data[currentMethod].push({
        name: pokemonNames[index],
        rate: pokemonRates[index],
        level: pokemonLevels[index],
      });
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

  return encounterMethods;
}

function buildRouteObject(route, encounterMethods, encounters) {
  const areas = [];
  const trades = [];
  const gifts = [];
  const statics = [];

  encounterMethods.forEach((method) => {
    if (method === METHODS.static) return statics.push({ name: "", level: "" });

    if (method === METHODS.gift)
      return gifts.push({ name: "", level: 0, requirement: "" });

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
//       "areas": [
//         {
//           "method": "grass",
//           "pokemon": [
//             { "species": "264", "minLvl": 12, "maxLvl": 14, "rate": 20 }
//           ]
//         },
//         {
//           "method": "fishing-old-rod",
//           "pokemon": [{ "species": "", "minLvl": 12, "maxLvl": 14, "rate": 15 }]
//         }
//       ]
//     ,
//     "trades": [
//       {
//         "give": "ralts",
//         "receive": [{ "name": "", "item": "" }]
//       }
//     ],
//     "gifts": [{ "name": "", "level": 24, "requirement": "" }],
//     "static": [{ "name": "", "level": 14 }]
//   }
// ]
//
//
