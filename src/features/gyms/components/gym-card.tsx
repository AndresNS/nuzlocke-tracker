import { Card, Chip } from '@heroui/react';

import type { Gym } from '../types';

import { TrainerPokemonCard } from './trainer-pokemon-card';

type GymCardProps = Omit<Gym, 'badge'>;

export const GymCard: React.FC<GymCardProps> = ({
  leader,
  type,
  team,
  sprite,
  isDouble,
  location,
  levelCap,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <Card.Header>
          <div className="flex justify-between">
            <Card.Title>{location.name} Gym</Card.Title>
            <span>Level cap: {levelCap}</span>
          </div>
        </Card.Header>

        <Card.Content className="flex flex-row">
          <div>
            <img alt={leader} src={sprite} className="size-max" />
          </div>
          <div>
            <div>
              {leader}
              {isDouble && ' (Double Battle)'}
            </div>
            <Chip>{type}</Chip>
          </div>
        </Card.Content>
      </Card>
      <div className="grid grid-cols-3 gap-4">
        {team.map((pokemon) => (
          <TrainerPokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>
    </div>
  );
};
