export function cleanPercentage(percentage) {
  const percentageNumber = Number(percentage.replace("%", "").trim());

  if (Number.isNaN(percentageNumber)) return "N/A";
  return percentageNumber;
}

export function formatLevels(levels) {
  if (Number(levels) !== NaN) return { min: levels, max: levels };

  const levelsArray = levels.split("-");

  return {
    min: Number(levelsArray[0].trim()),
    max: Number(levelsArray[1].trim()),
  };
}
