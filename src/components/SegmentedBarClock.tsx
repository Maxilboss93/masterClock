interface SegmentedBarClockProps {
  segments: number
  filled: number
  onSetFilled: (filled: number) => void
  disabled?: boolean
}

export function SegmentedBarClock({
  segments,
  filled,
  onSetFilled,
  disabled = false,
}: SegmentedBarClockProps) {
  return (
    <div
      className="segmented-clock"
      role="group"
      aria-label="Barra segmentata"
      aria-disabled={disabled}
    >
      {Array.from({ length: segments }, (_, index) => (
        <button
          key={index}
          type="button"
          className={index < filled ? 'bar-segment filled' : 'bar-segment'}
          onClick={() => onSetFilled(index + 1)}
          aria-label={`Imposta avanzamento a ${index + 1}`}
          disabled={disabled}
        />
      ))}
    </div>
  )
}
