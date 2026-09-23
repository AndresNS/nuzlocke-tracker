export function cleanPercentage(percentage) {
  return Number(percentage.replace("%", "").trim());
}

export function formatLevels(levels) {
  if (Number(levels) !== NaN) return { min: levels, max: levels };

  const levelsArray = levels.split("-");

  return {
    min: Number(levelsArray[0].trim()),
    max: Number(levelsArray[1].trim()),
  };
}
