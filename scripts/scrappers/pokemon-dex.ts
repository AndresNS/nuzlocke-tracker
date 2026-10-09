import type { BasePokemon } from '@/types.ts';

import { cheerioQuery } from '../utils/cheerio-query.ts';

const SOURCE_URL = 'https://pokemondb.net/pokedex/game/ruby-sapphire-emerald';

export const getPokemonDex = async (): Promise<BasePokemon[]> => {
  const $ = await cheerioQuery(SOURCE_URL);

  const data = $.extract({
    pokemon: [
      {
        selector: 'div.infocard',
        value: {
          id: {
            selector: 'span.infocard-lg-data small',
            value: (el) => $(el).text().replace('#', ''),
          },
          name: 'span.infocard-lg-data a.ent-name',
          types: [
            {
              selector: 'span.infocard-lg-data > small a.itype',
              value: (el) => $(el).text().toLowerCase(),
            },
          ],
          sprite: {
            selector: 'span.infocard-lg-img a img.img-sprite',
            value: (el) => $(el).attr('src'),
          },
        },
      },
    ],
  });

  return data.pokemon as BasePokemon[];
};
