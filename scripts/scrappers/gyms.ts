import * as cheerio from 'cheerio';
import type { Element } from 'domhandler';

import type { Gym, Item, Move, PokemonType, TrainerPokemon } from '@/types.ts';

import { cheerioQuery } from '../utils/cheerio-query.ts';

const SOURCE_URL = {
  POKEMONDB: 'https://pokemondb.net/emerald/gymleaders-elitefour',
  SEREBII: 'https://www.serebii.net/emerald/gym.shtml',
};

const $pokemondb = await cheerioQuery(SOURCE_URL.POKEMONDB);
const $serebii = await cheerioQuery(SOURCE_URL.SEREBII);

export const getGyms = () => {
  const $ = $pokemondb;
  const gyms: Gym[] = [];

  $('h2:contains("Gym")').each((_, element) => {
    const gymElement = $(element).next();

    const leader = $(gymElement)
      .find('span.trainer-head')
      .find('span.ent-name')
      .text();

    const sprite = $(gymElement)
      .find('span.trainer-head')
      .find('img')
      .attr('src');

    const gymType = $(gymElement)
      .find('small > span.itype')
      .attr('class')
      ?.split(' ')[1] as PokemonType;

    const badge = $(gymElement).find('small').text().split(' ')[0];

    // Get Team
    const team: Gym['team'] = [];

    $(gymElement)
      .find('div.trainer-pkmn')
      .each((i, pkmnElement) => {
        const pkmnData = getGymPokemon($, pkmnElement, leader, i);
        team.push(pkmnData);
      });

    const gymData: Gym = {
      leader,
      sprite: sprite ?? '',
      type: gymType,
      badge,
      team,
      isDouble: leader === 'Tate & Liza',
      location: { name: '', id: '' },
    };

    gyms.push(gymData);
  });

  return gyms;
};

const getGymPokemon = (
  $: cheerio.CheerioAPI,
  pkmnElement: Element,
  leader: string,
  index: number,
): TrainerPokemon => {
  const pkmnNumber = $(pkmnElement)
    .find('span.infocard-lg-data')
    .children('small')
    .first()
    .text()
    .replace('#', '');

  const name = $(pkmnElement)
    .find('span.infocard-lg-data')
    .children('a.ent-name')
    .text();

  const level = $(pkmnElement)
    .find('span.infocard-lg-data')
    .children('small:contains("Level")')
    .text()
    .replace('Level ', '');

  const sprite = $(pkmnElement)
    .find('span.infocard-lg-img')
    .find('img.img-sprite')
    .attr('src');

  const types: PokemonType[] = [];

  $(pkmnElement)
    .find('span.infocard-lg-data')
    .find('small a.itype')
    .each((_, typeElement) => {
      types.push($(typeElement).text() as PokemonType);
    });

  const { item, moves } = getTeamData($serebii, leader, index);

  return {
    id: pkmnNumber,
    name,
    level: Number(level),
    sprite: sprite ?? '',
    types,
    item,
    moves,
  };
};

const getTeamData = (
  $: cheerio.CheerioAPI,
  leader: string,
  index: number,
): { moves: Move[]; item: Item } => {
  const pokemon: Record<number, { name: string; moves: Move[]; item: Item }> =
    {};

  const gymTable = $(`table.trainer td:contains("${leader}")`)
    .parent()
    .parent();

  $(gymTable)
    .find('tr')
    .eq(1)
    .find('td')
    .each((i, element) => {
      if (i === index + 1) {
        pokemon[index] = { ...pokemon[index], name: $(element).text() };
      }
    });

  const pkmnMoves = $(gymTable)
    .find('tr')
    .eq(6)
    .find('td')
    .eq(index)
    .find('a')
    .map((_, move) => $(move).text().trim())
    .get()
    .map((move) => ({ name: move, url: '' }));

  pokemon[index] = {
    ...pokemon[index],
    moves: pkmnMoves,
  };

  const pkmnItem = $(gymTable)
    .find('tr')
    .eq(7)
    .find('td')
    .eq(index)
    .find('a')
    .map((_, item) => $(item).text().trim())
    .get()
    .map((item) => ({ name: item, url: '' }))[0];

  pokemon[index] = {
    ...pokemon[index],
    item: pkmnItem,
  };

  return pokemon[index];
};
