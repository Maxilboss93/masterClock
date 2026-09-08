import type { BoardTrack } from '../types/campaign'
import { TrackToken } from './TrackToken'

interface TrackRailProps {
  tracks: Array<{
    track: BoardTrack
    canDelete: boolean
    onDelete?: (id: string) => void
    onMoveToBoard: (id: string) => void
    onTrackChange: (id: string, patch: Partial<BoardTrack>) => void
  }>
}

export function TrackRail({ tracks }: TrackRailProps) {
  if (tracks.length === 0) {
    return null
  }

  return (
    <section className="track-rail" aria-label="Barre fissate in alto">
      <h2>Barre</h2>
      <div className="top-track-list">
        {tracks.map(({ track, canDelete, onDelete, onMoveToBoard, onTrackChange }) => (
          <TrackToken
            key={track.id}
            track={track}
            variant="top"
            canDelete={canDelete}
            onUpdate={onTrackChange}
            onMove={() => undefined}
            onDelete={onDelete ?? (() => undefined)}
            onTogglePinnedTop={(id) => onMoveToBoard(id)}
          />
        ))}
      </div>
    </section>
  )
}
