import * as cheerio from 'cheerio';
import type { Element } from 'domhandler';

import type { Item, Move, PokemonType, TrainerPokemon } from '@/types.ts';

export const getGymPokemon = (
  $: cheerio.CheerioAPI,
  pkmnElement: Element,
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

  const item: Item = { name: '', url: '' };
  const moves: Move[] = [];

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
