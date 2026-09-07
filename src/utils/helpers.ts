import pokemonEvolutionLines from "../../data/pokemon-evolution-lines.json";

type EvolutionLine = string[];

const evolutionLines = pokemonEvolutionLines as EvolutionLine[];

export const getEvolutionLine = (pokemon: string): EvolutionLine => {
  const evolutionLine = evolutionLines.find((family) =>
    family.includes(pokemon),
  );

  return evolutionLine ?? [];
};
