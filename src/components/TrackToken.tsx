import { GripHorizontal, Lock, Pin, PinOff, Trash2, Unlock } from 'lucide-react'
import type { RefObject } from 'react'
import type { BoardTrack } from '../types/campaign'
import { TrackSquares } from './TrackSquares'

interface TrackTokenProps {
  track: BoardTrack
  boardRef?: RefObject<HTMLDivElement | null>
  variant?: 'board' | 'top'
  canDelete?: boolean
  onUpdate: (id: string, patch: Partial<BoardTrack>) => void
  onMove: (id: string, x: number, y: number) => void
  onDelete: (id: string) => void
  onTogglePinnedTop?: (id: string, pinnedToTop: boolean) => void
}

export function TrackToken({
  track,
  boardRef,
  variant = 'board',
  canDelete = true,
  onUpdate,
  onMove,
  onDelete,
  onTogglePinnedTop,
}: TrackTokenProps) {
  const beginDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    const boardElement = boardRef?.current

    if (variant === 'top' || track.locked || !boardElement) {
      return
    }

    const boardRect = boardElement.getBoundingClientRect()
    const tokenRect = event.currentTarget.closest('.track-token')?.getBoundingClientRect()
    const startX = event.clientX
    const startY = event.clientY
    const initialX = track.position.x
    const initialY = track.position.y

    event.currentTarget.setPointerCapture(event.pointerId)

    const handleMove = (moveEvent: PointerEvent) => {
      const nextX = initialX + moveEvent.clientX - startX
      const nextY = initialY + moveEvent.clientY - startY

      onMove(
        track.id,
        Math.min(Math.max(nextX, 0), boardRect.width - (tokenRect?.width ?? 220)),
        Math.min(Math.max(nextY, 0), boardRect.height - (tokenRect?.height ?? 120)),
      )
    }

    const handleUp = () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
  }

  return (
    <article
      className={[
        'track-token',
        track.size,
        variant === 'top' ? 'top-pinned' : '',
        canDelete ? 'has-delete' : '',
      ].join(' ')}
      style={variant === 'board' ? { left: track.position.x, top: track.position.y } : undefined}
    >
      <div className="track-token-topline">
        <button
          type="button"
          className="drag-handle"
          onPointerDown={beginDrag}
          aria-label={variant === 'top' ? 'Barra fissata in alto' : 'Sposta barra'}
        >
          <GripHorizontal aria-hidden="true" size={18} />
        </button>
        <input
          value={track.name}
          onChange={(event) => onUpdate(track.id, { name: event.target.value })}
          aria-label="Titolo card"
        />
        <strong>{track.value > 0 ? `+${track.value}` : track.value}</strong>
        <button
          type="button"
          className="icon-button small"
          onClick={() => onTogglePinnedTop?.(track.id, !track.pinnedToTop)}
          aria-label={track.pinnedToTop ? 'Sposta in plancia' : 'Fissa in alto'}
        >
          {track.pinnedToTop ? (
            <PinOff aria-hidden="true" size={15} />
          ) : (
            <Pin aria-hidden="true" size={15} />
          )}
        </button>
        <button
          type="button"
          className="icon-button small"
          onClick={() => onUpdate(track.id, { locked: !track.locked })}
          aria-label={track.locked ? 'Sblocca posizione' : 'Blocca posizione'}
        >
          {track.locked ? (
            <Lock aria-hidden="true" size={15} />
          ) : (
            <Unlock aria-hidden="true" size={15} />
          )}
        </button>
      </div>

      <input
        className="graph-label-input"
        value={track.graphLabel || track.name}
        onChange={(event) => onUpdate(track.id, { graphLabel: event.target.value })}
        aria-label="Label grafico"
      />

      <TrackSquares
        track={track}
        onValueChange={(value) => onUpdate(track.id, { value })}
      />

      <div className="track-label-row">
        <input
          value={track.leftLabel}
          onChange={(event) => onUpdate(track.id, { leftLabel: event.target.value })}
          aria-label={`${track.name}: etichetta sinistra`}
        />
        <span>{track.centerLabel}</span>
        <input
          value={track.rightLabel}
          onChange={(event) => onUpdate(track.id, { rightLabel: event.target.value })}
          aria-label={`${track.name}: etichetta destra`}
        />
      </div>

      <div className="track-token-footer">
        <label>
          Centro
          <input
            value={track.centerLabel}
            onChange={(event) => onUpdate(track.id, { centerLabel: event.target.value })}
          />
        </label>
        {canDelete ? (
          <button
            type="button"
            className="icon-button danger track-delete-button"
            onClick={() => onDelete(track.id)}
            aria-label="Elimina barra"
          >
            <Trash2 aria-hidden="true" size={16} />
          </button>
        ) : null}
      </div>
    </article>
  )
}
