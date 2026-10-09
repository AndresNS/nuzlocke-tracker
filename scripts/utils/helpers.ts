import * as cheerio from 'cheerio';
import type { Element } from 'domhandler';

import type { Method } from '@/features/encounters/constants.ts';

import { METHOD } from '../../src/features/encounters/constants.ts';
import type { SerebiiMethod } from '../types.ts';

export function cleanPercentage(percentage: string) {
  const percentageNumber = Number(percentage.replace('%', '').trim());

  if (Number.isNaN(percentageNumber)) return 'N/A';
  return percentageNumber;
}

export function formatLevels(levels: string) {
  if (!Number.isNaN(Number(levels)))
    return { min: Number(levels), max: Number(levels) };

  const levelsArray = levels.split('-');

  return {
    min: Number(levelsArray[0].trim()),
    max: Number(levelsArray[1].trim()),
  };
}

export function serebiiMethodtoMethod(
  method: SerebiiMethod,
  element: Element,
  $: cheerio.CheerioAPI,
): Method {
  let refinedMethod;

  if (method === 'fish') {
    const rod = $(element).find('a').text();
    refinedMethod = `fish-${rod.replace(' ', '').toLowerCase()}` as Method;
  }

  if (method === 'grass') return 'walking';

  if (method === 'interact') return 'static';

  return refinedMethod ?? method;
}

export function getSerebiiMethodMapping(method: Method): {
  serebiiMethod: SerebiiMethod;
  method: Method;
} {
  if (method.startsWith('fish')) return { serebiiMethod: 'fish', method };
  if (method === 'static') return { serebiiMethod: 'interact', method };
  if (method === 'walking') return { serebiiMethod: 'grass', method };

  return { serebiiMethod: method as SerebiiMethod, method };
}

export function isAreaMethod(method: Method) {
  const areaMethods: Method[] = [
    METHOD.FISH,
    METHOD.SURF,
    METHOD.WALKING,
    METHOD.FISH_OLD_ROD,
    METHOD.FISH_GOOD_ROD,
    METHOD.FISH_SUPER_ROD,
    METHOD.ROCKSMASH,
  ];

  return areaMethods.includes(method);
}
