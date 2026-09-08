import type { CSSProperties } from 'react'
import type { Track } from '../types/campaign'

interface TrackSquaresProps {
  track: Track
  onValueChange: (value: number) => void
}

export function TrackSquares({ track, onValueChange }: TrackSquaresProps) {
  const label = track.graphLabel || track.name
  const values = Array.from(
    { length: track.max - track.min + 1 },
    (_, index) => track.min + index,
  )

  return (
    <div
      className="track-squares"
      style={{ '--track-count': values.length } as CSSProperties}
      role="group"
      aria-label={label}
    >
      {values.map((value) => {
        const isCenter = value === 0
        const isSelected = value === track.value

        return (
          <button
            key={value}
            type="button"
            className={[
              'track-square',
              isCenter ? 'center' : '',
              isSelected ? 'selected' : '',
            ].join(' ')}
            onClick={() => onValueChange(value)}
            aria-label={`${label}: ${value}`}
            aria-pressed={isSelected}
          >
            {isCenter ? track.centerLabel : ''}
          </button>
        )
      })}
    </div>
  )
}
