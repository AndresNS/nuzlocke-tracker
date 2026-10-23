import { Chip } from '@heroui/react';

import type { PokemonType } from '@/types';

interface TypeBadgeProps {
  type: PokemonType;
}

export const TypeBadge: React.FC<TypeBadgeProps> = ({ type }) => {
  return <Chip key={type}>{type}</Chip>;
};
