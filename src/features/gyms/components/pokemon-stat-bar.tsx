import { Label, ProgressBar } from '@heroui/react';

interface PokemonStatBarProps {
  name: string;
  value: number;
}

const maxBaseStat = 255;

export const PokemonStatBar: React.FC<PokemonStatBarProps> = ({
  name,
  value,
}) => {
  return (
    <div>
      <ProgressBar
        value={value}
        maxValue={maxBaseStat}
        size="md"
        className="flex flex-row items-center"
      >
        <Label className="flex-1">{name.toUpperCase()}</Label>
        <Label className="flex-1">{value}</Label>
        <div className="flex-5">
          <ProgressBar.Track>
            <ProgressBar.Fill />
          </ProgressBar.Track>
        </div>
      </ProgressBar>
    </div>
  );
};
