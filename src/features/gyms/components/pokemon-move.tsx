import { Label, Tooltip } from '@heroui/react';

import type { Move } from '@/types';

import TypeBadge from './type-badge';

const PokemonMove: React.FC<Move> = ({ name, type, power, effect }) => {
  return (
    <Tooltip delay={0}>
      <Tooltip.Trigger>
        <div>
          <div className="mb-1 flex justify-between">
            <Label>{name}</Label>
            <Label>{power}</Label>
          </div>
          <div>
            <TypeBadge type={type} />
          </div>
        </div>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <p>{effect}</p>
      </Tooltip.Content>
    </Tooltip>
  );
};

export default PokemonMove;
