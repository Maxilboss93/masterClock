export function normalizeSegmentCount(value: number) {
  if (!Number.isFinite(value)) {
    return 2
  }

  return Math.max(2, Math.round(value))
}

export function normalizeTrackCellCount(value: number) {
  if (!Number.isFinite(value)) {
    return 2
  }

  return Math.max(2, Math.round(value))
}

export function getCenteredTrackRange(cellCount: number) {
  const normalizedCellCount = normalizeTrackCellCount(cellCount)
  const min = -Math.floor(normalizedCellCount / 2)

  return {
    min,
    max: min + normalizedCellCount - 1,
  }
}
