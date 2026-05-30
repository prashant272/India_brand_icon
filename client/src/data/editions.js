

export function getEditionByYear(year) {
  const y = Number(year);
  return EDITIONS.find((e) => e.year === y) || null;
}
