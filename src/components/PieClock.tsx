interface PieClockProps {
  segments: number
  filled: number
  onSetFilled: (filled: number) => void
  disabled?: boolean
}

const polarToCartesian = (center: number, radius: number, angle: number) => {
  const radians = ((angle - 90) * Math.PI) / 180
  return {
    x: center + radius * Math.cos(radians),
    y: center + radius * Math.sin(radians),
  }
}

const describeSlice = (
  center: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) => {
  const start = polarToCartesian(center, radius, endAngle)
  const end = polarToCartesian(center, radius, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'

  return [
    `M ${center} ${center}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    'Z',
  ].join(' ')
}

export function PieClock({ segments, filled, onSetFilled, disabled = false }: PieClockProps) {
  return (
    <svg
      className={disabled ? 'pie-clock disabled' : 'pie-clock'}
      viewBox="0 0 100 100"
      role="img"
      aria-label="Clock a torta"
      aria-disabled={disabled}
    >
      {Array.from({ length: segments }, (_, index) => {
        const startAngle = (index / segments) * 360
        const endAngle = ((index + 1) / segments) * 360
        const isFilled = index < filled

        return (
          <path
            key={index}
            d={describeSlice(50, 44, startAngle, endAngle)}
            className={isFilled ? 'clock-segment filled' : 'clock-segment'}
            onClick={() => {
              if (!disabled) {
                onSetFilled(index + 1)
              }
            }}
            tabIndex={disabled ? -1 : 0}
            onKeyDown={(event) => {
              if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
                event.preventDefault()
                onSetFilled(index + 1)
              }
            }}
          />
        )
      })}
      <circle className="pie-clock-center" cx="50" cy="50" r="10" />
    </svg>
  )
}
