import type { Track } from '../types/campaign'
import { TrackSquares } from './TrackSquares'

interface FixedTracksProps {
  tracks: Track[]
  onTrackChange: (id: string, patch: Partial<Track>) => void
}

export function FixedTracks({ tracks, onTrackChange }: FixedTracksProps) {
  return (
    <section className="fixed-tracks" aria-label="Barre fisse">
      {tracks.map((track) => (
        <article className="track-card" key={track.id}>
          <div className="track-card-header">
            <input
              className="track-name-input"
              value={track.name}
              onChange={(event) =>
                onTrackChange(track.id, { name: event.target.value })
              }
              aria-label="Nome barra"
            />
            <strong>{track.value > 0 ? `+${track.value}` : track.value}</strong>
          </div>

          <TrackSquares
            track={track}
            onValueChange={(value) => onTrackChange(track.id, { value })}
          />

          <div className="track-label-row">
            <input
              value={track.leftLabel}
              onChange={(event) =>
                onTrackChange(track.id, { leftLabel: event.target.value })
              }
              aria-label={`${track.name}: etichetta sinistra`}
            />
            <span>{track.centerLabel}</span>
            <input
              value={track.rightLabel}
              onChange={(event) =>
                onTrackChange(track.id, { rightLabel: event.target.value })
              }
              aria-label={`${track.name}: etichetta destra`}
            />
          </div>
        </article>
      ))}
    </section>
  )
}
