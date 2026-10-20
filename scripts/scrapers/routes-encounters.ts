import * as cheerio from 'cheerio';

import type { Method } from '@/features/encounters/constants.ts';
import type {
  Area,
  AreaEncounter,
  PokemonEncounter,
  Route,
  Trade,
} from '@/features/encounters/types.ts';

import routesList from '../data/pokemon-routes.json' with { type: 'json' };
import { getRouteGifts } from '../patches/gifts.ts';
import { getRouteStatics } from '../patches/static.ts';
import { getRouteTrades } from '../patches/trades.ts';
import type { SerebiiMethod } from '../types.ts';
import { cheerioQuery } from '../utils/cheerio-query.ts';
import { serebiiMethodsMap } from '../utils/constants.ts';
import {
  cleanPercentage,
  formatLevels,
  getSerebiiMethodMapping,
  isAreaMethod,
  serebiiMethodtoMethod,
} from '../utils/helpers.ts';
import { patchedRoutes } from '../utils/patches.ts';

const config = {
  testing: false,
  testRoute: 'route102',
};

export const getRoutesEncounters = async (): Promise<Route[]> => {
  if (config.testing) {
    const ROUTE_URL = `https://www.serebii.net/pokearth/hoenn/3rd/${config.testRoute}.shtml`;
    const $ = await cheerioQuery(ROUTE_URL);

    const routeData = buildRouteObject($, {
      id: config.testRoute,
      name: 'Test Route',
    });

    return [routeData];
  }

  const encounters: Route[] = await Promise.all(
    (routesList as { id: string; name: string }[]).map(
      async (route): Promise<Route> => {
        const ROUTE_URL = `https://www.serebii.net/pokearth/hoenn/3rd/${route.id}.shtml`;
        const $ = await cheerioQuery(ROUTE_URL);

        const routeData = buildRouteObject($, route);

        return routeData;
      },
    ),
  );

  return encounters;
};

const getRouteMethods = ($: cheerio.CheerioAPI): Method[] => {
  const methodsAnchorsTable = $('table.anctab').filter((_, element) => {
    return (
      $(element)
        .find('td')
        .filter((_, el) => {
          return $(el).text() === 'Anchors';
        }).length > 0
    );
  });

  const serebiiMethods = Object.keys(serebiiMethodsMap);

  const routeMethods: Method[] = [];

  $(methodsAnchorsTable)
    .find('td')
    .each((_, element) => {
      const method = $(element).attr('class') as SerebiiMethod;

      if (serebiiMethods.includes(method))
        routeMethods.push(serebiiMethodtoMethod(method, element, $));
    });

  return routeMethods;
};

const getRouteAreas = ($: cheerio.CheerioAPI, methods: Method[]): Area[] => {
  const routeEncounters: Area[] = methods
    .filter((method) => isAreaMethod(method))
    .map((method) => {
      const serebiiMethod = getSerebiiMethodMapping(method).serebiiMethod;

      let selector = `td.${serebiiMethod}`;

      if (serebiiMethod === 'fish')
        selector = `td.fish:has(a[name='${method.split('-')[1]}'])`;

      const methodElement = $(selector);
      const gameEncountersTable = $(methodElement).closest(
        'table.extradextable',
      );
      const emeraldEncounters = $(gameEncountersTable)
        .nextUntil('table:has(td.emerald)')
        .next();

      const pokemonNames = $(emeraldEncounters)
        .find('td.name')
        .map((_, element) => $(element).text())
        .toArray();
      const pokemonRates = $(emeraldEncounters)
        .find('td.rate')
        .map((_, element) => cleanPercentage($(element).text()))
        .toArray();
      const pokemonLevels = $(emeraldEncounters)
        .find('td.level')
        .map((_, element) => formatLevels($(element).text()))
        .toArray();

      const encounters: AreaEncounter[] = pokemonNames.map((species, i) => ({
        species: species.toLowerCase(),
        rate: pokemonRates[i] as number,
        level: pokemonLevels[i],
      }));

      return { method, encounters };
    });

  return routeEncounters;
};

const buildRouteObject = (
  $: cheerio.CheerioAPI,
  route: { id: string; name: string },
) => {
  if (patchedRoutes[route.id]) {
    const patch = patchedRoutes[route.id];

    if (patch) return patch(route.id);
  }

  const routeMethods = getRouteMethods($);
  const routeAreas: Area[] = getRouteAreas($, routeMethods);
  const routeGifts: PokemonEncounter[] = getRouteGifts(route.id);
  const routeTrades: Trade[] = getRouteTrades(route.id);
  const routeStatic: PokemonEncounter[] = getRouteStatics(route.id);

  return {
    id: route.id,
    name: route.name,
    areas: routeAreas,
    trades: routeTrades,
    gifts: routeGifts,
    static: routeStatic,
  };
};
