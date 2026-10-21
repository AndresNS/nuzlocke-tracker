import type { Move } from '@/types.ts';

import { cheerioQuery } from '../utils/cheerio-query.ts';

const SOURCE_URL = 'https://pokemondb.net/move/generation/3';
const BASE_URL = 'https://pokemondb.net';

export const getMoves = async (): Promise<Move[]> => {
  const $ = await cheerioQuery(SOURCE_URL);

  const data = $.extract({
    move: [
      {
        selector: 'table#moves tbody tr',
        value: {
          name: 'td.cell-name a.ent-name',
          type: {
            selector: 'td.cell-icon a.type-icon',
            value: (el) => $(el).text().toLowerCase(),
          },
          power: {
            selector: 'td.cell-num:first',
            value: (el) => Number($(el).text()),
          },
          url: {
            selector: 'td.cell-name a.ent-name',
            value: (el) => `${BASE_URL}${$(el).attr('href') ?? ''}`,
          },
          effect: 'td.cell-long-text',
        },
      },
    ],
  });

  return data.move as Move[];
};
