export const METHOD = {
  GRASS: 'grass',
  SURF: 'surf',
  FISH: 'fish',
  FISH_OLD_ROD: 'fish-oldrod',
  FISH_GOOD_ROD: 'fish-goodrod',
  FISH_SUPER_ROD: 'fish-superrod',
  ROCKSMASH: 'rocksmash',
  GIFT: 'gift',
  STATIC: 'static',
  TRADE: 'trade',
} as const;

export type Method = (typeof METHOD)[keyof typeof METHOD];

export const METHOD_LABELS: Record<Method, string> = {
  grass: 'Grass',
  surf: 'Surfing',
  fish: 'Fishing',
  'fish-oldrod': 'Fishing - Old Rod',
  'fish-goodrod': 'Fishing - Good Rod',
  'fish-superrod': 'Fishing - Super Rod',
  rocksmash: 'Rock Smash',
  gift: 'Gift',
  static: 'Static Encounter',
  trade: 'Trade',
};

export const ROUTE_STATE = {
  MISSED: 'missed',
};
