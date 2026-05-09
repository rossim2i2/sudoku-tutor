export const combinations = <T>(items: T[], size: number): T[][] => {
  if (size === 0) return [[]]
  if (items.length < size) return []

  const [first, ...rest] = items
  return [
    ...combinations(rest, size - 1).map((combo) => [first, ...combo]),
    ...combinations(rest, size),
  ]
}
