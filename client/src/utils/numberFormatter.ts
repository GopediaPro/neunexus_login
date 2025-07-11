export const formatNumber = (value: number): string => {
  const formatted = value.toLocaleString();

  if (value >= 1_000_000) {
    return `${formatted}...`;
  }

  return formatted;
};