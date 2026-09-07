import type { Track } from '../types/campaign'

interface TrackSquaresProps {
  track: Track
  onValueChange: (value: number) => void
}

export function TrackSquares({ track, onValueChange }: TrackSquaresProps) {
  const values = Array.from(
    { length: track.max - track.min + 1 },
    (_, index) => track.min + index,
  )

  return (
    <div className="track-squares" role="group" aria-label={track.name}>
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
            aria-label={`${track.name}: ${value}`}
            aria-pressed={isSelected}
          >
            {isCenter ? track.centerLabel : ''}
          </button>
        )
      })}
    </div>
  )
}
