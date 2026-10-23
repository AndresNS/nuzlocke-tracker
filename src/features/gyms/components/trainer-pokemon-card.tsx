import { Card } from '@heroui/react';

import { STAT_KEYS } from '@/constants';
import { type TrainerPokemon } from '@/types';

import { PokemonMove } from './pokemon-move';
import { PokemonStatBar } from './pokemon-stat-bar';
import { TypeBadge } from './type-badge';

interface TrainerPokemonCardProps {
  pokemon: Omit<TrainerPokemon, 'id'>;
}
export const TrainerPokemonCard: React.FC<TrainerPokemonCardProps> = ({
  pokemon,
}) => {
  const { types, item, level, moves, stats, name, sprite } = pokemon;

  return (
    <>
      <Card>
        <Card.Header>
          <div>
            <img alt={name} src={sprite} className="size-max" />
            <Card.Title>{name}</Card.Title>
            <Card.Description>Level {level}</Card.Description>
            <div className="flex gap-2">
              {types.map((type) => (
                <TypeBadge key={type} type={type} />
              ))}
            </div>
            {item?.name && <span>Item: {item.name}</span>}
          </div>
        </Card.Header>

        {/* Stats */}
        <div>
          {STAT_KEYS.map((stat) => (
            <div key={stat}>
              <PokemonStatBar name={stat} value={stats[stat]} />
            </div>
          ))}
        </div>

        {/* Moves */}
        <Card.Content className="grid grid-cols-2 gap-4">
          {moves.map((move) => (
            <PokemonMove key={move.name} {...move} />
          ))}
        </Card.Content>
      </Card>
    </>
  );
};
