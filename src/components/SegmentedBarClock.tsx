interface SegmentedBarClockProps {
  segments: number
  filled: number
  onSetFilled: (filled: number) => void
}

export function SegmentedBarClock({
  segments,
  filled,
  onSetFilled,
}: SegmentedBarClockProps) {
  return (
    <div
      className="segmented-clock"
      role="group"
      aria-label="Clock a barra segmentata"
    >
      {Array.from({ length: segments }, (_, index) => (
        <button
          key={index}
          type="button"
          className={index < filled ? 'bar-segment filled' : 'bar-segment'}
          onClick={() => onSetFilled(index + 1)}
          aria-label={`Imposta avanzamento a ${index + 1}`}
        />
      ))}
    </div>
  )
}
