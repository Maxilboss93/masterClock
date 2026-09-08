import { GripHorizontal, Lock, Pin, PinOff, Trash2, Unlock } from 'lucide-react'
import type { RefObject } from 'react'
import { getCenteredTrackRange, normalizeTrackCellCount } from '../state/numbers'
import type { BoardTrack } from '../types/campaign'
import { TrackSquares } from './TrackSquares'

interface TrackTokenProps {
  track: BoardTrack
  boardRef?: RefObject<HTMLDivElement | null>
  variant?: 'board' | 'top'
  layout?: 'free' | 'grid'
  canDelete?: boolean
  onUpdate: (id: string, patch: Partial<BoardTrack>) => void
  onMove: (id: string, x: number, y: number) => void
  onDelete: (id: string) => void
  onTogglePinnedTop?: (id: string, pinnedToTop: boolean) => void
  onDragStart?: () => void
  onDragEnd?: () => void
}

export function TrackToken({
  track,
  boardRef,
  variant = 'board',
  layout = 'free',
  canDelete = true,
  onUpdate,
  onMove,
  onDelete,
  onTogglePinnedTop,
  onDragStart,
  onDragEnd,
}: TrackTokenProps) {
  const cellCount = track.max - track.min + 1
  const formattedValue = track.value > 0 ? `+${track.value}` : String(track.value)

  const updateCellCount = (value: number) => {
    const range = getCenteredTrackRange(normalizeTrackCellCount(value))

    onUpdate(track.id, range)
  }

  const beginDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    const boardElement = boardRef?.current
    const tokenRect = event.currentTarget.closest('.track-token')?.getBoundingClientRect()

    if (variant === 'top' || track.locked || !boardElement || !tokenRect) {
      return
    }

    const boardRect = boardElement.getBoundingClientRect()
    const startX = event.clientX
    const startY = event.clientY
    const initialX =
      layout === 'grid' ? tokenRect.left - boardRect.left : track.position.x
    const initialY =
      layout === 'grid' ? tokenRect.top - boardRect.top : track.position.y

    event.currentTarget.setPointerCapture(event.pointerId)
    onMove(track.id, initialX, initialY)
    onDragStart?.()

    const handleMove = (moveEvent: PointerEvent) => {
      const nextX = initialX + moveEvent.clientX - startX
      const nextY = initialY + moveEvent.clientY - startY

      onMove(
        track.id,
        Math.min(Math.max(nextX, 0), boardRect.width - tokenRect.width),
        Math.max(nextY, 0),
      )
    }

    const handleUp = () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
      onDragEnd?.()
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
        track.locked ? 'is-locked' : '',
        layout === 'grid' ? 'grid-item' : '',
        canDelete ? 'has-delete' : '',
      ].join(' ')}
      aria-readonly={track.locked}
      style={
        variant === 'board' && layout === 'free'
          ? { left: track.position.x, top: track.position.y }
          : undefined
      }
    >
      <div className="track-token-topline">
        <button
          type="button"
          className="drag-handle"
          onPointerDown={beginDrag}
          aria-label={
            variant === 'top'
              ? 'Barra fissata in alto'
              : layout === 'grid'
                ? 'Sposta barra agganciata'
                : 'Sposta barra'
          }
          disabled={variant === 'top' || track.locked}
        >
          <GripHorizontal aria-hidden="true" size={18} />
        </button>
        <input
          value={track.name}
          placeholder="Titolo barra"
          onChange={(event) => onUpdate(track.id, { name: event.target.value })}
          aria-label="Titolo card"
          disabled={track.locked}
        />
        <strong className="track-value-badge" aria-label={`Valore corrente ${formattedValue}`}>
          {formattedValue}
        </strong>
        <button
          type="button"
          className="icon-button small"
          onClick={() => onTogglePinnedTop?.(track.id, !track.pinnedToTop)}
          aria-label={track.pinnedToTop ? 'Sposta in plancia' : 'Fissa in alto'}
          disabled={track.locked}
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
          aria-label={track.locked ? 'Sblocca card' : 'Blocca card'}
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
        placeholder="Label grafico"
        onChange={(event) => onUpdate(track.id, { graphLabel: event.target.value })}
        aria-label="Label grafico"
        disabled={track.locked}
      />

      <TrackSquares
        track={track}
        onValueChange={(value) => onUpdate(track.id, { value })}
        disabled={track.locked}
      />

      <div className="track-label-row">
        <div className="track-end-label">
          <span className="track-end-value">{track.min}</span>
          <input
            value={track.leftLabel}
            placeholder="es. Sociale"
            onChange={(event) => onUpdate(track.id, { leftLabel: event.target.value })}
            aria-label={`${track.name}: etichetta sinistra`}
            disabled={track.locked}
          />
        </div>
        <span>{track.centerLabel}</span>
        <div className="track-end-label right">
          <span className="track-end-value">{track.max > 0 ? `+${track.max}` : track.max}</span>
          <input
            value={track.rightLabel}
            placeholder="es. Fisico"
            onChange={(event) => onUpdate(track.id, { rightLabel: event.target.value })}
            aria-label={`${track.name}: etichetta destra`}
            disabled={track.locked}
          />
        </div>
      </div>

      <div className="track-token-footer">
        <label>
          Caselle
          <input
            type="number"
            min={2}
            value={cellCount}
            onChange={(event) => updateCellCount(Number(event.target.value))}
            disabled={track.locked}
          />
        </label>
        <label>
          Centro
          <input
            value={track.centerLabel}
            placeholder="es. 0"
            onChange={(event) => onUpdate(track.id, { centerLabel: event.target.value })}
            disabled={track.locked}
          />
        </label>
        {canDelete ? (
          <button
            type="button"
            className="icon-button danger track-delete-button"
            onClick={() => onDelete(track.id)}
            aria-label="Elimina barra"
            disabled={track.locked}
          >
            <Trash2 aria-hidden="true" size={16} />
          </button>
        ) : null}
      </div>
    </article>
  )
}
