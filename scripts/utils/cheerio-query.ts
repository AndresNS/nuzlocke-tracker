import * as cheerio from 'cheerio';

import { fetchHTML } from './fetcher.ts';

export const cheerioQuery = async (url: string) => {
  const html = await fetchHTML(url);
  return cheerio.load(html);
};
