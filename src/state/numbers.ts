export function normalizeSegmentCount(value: number) {
  if (!Number.isFinite(value)) {
    return 2
  }

  return Math.max(2, Math.round(value))
}
