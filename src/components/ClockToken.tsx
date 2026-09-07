import {
  GripHorizontal,
  Lock,
  Minus,
  Pin,
  PinOff,
  Plus,
  Trash2,
  Unlock,
} from 'lucide-react'
import type { RefObject } from 'react'
import type { Clock, ClockColor, ClockType } from '../types/campaign'
import { PieClock } from './PieClock'
import { SegmentedBarClock } from './SegmentedBarClock'

interface ClockTokenProps {
  clock: Clock
  boardRef: RefObject<HTMLDivElement | null>
  onUpdate: (id: string, patch: Partial<Clock>) => void
  onSetFilled: (id: string, filled: number) => void
  onMove: (id: string, x: number, y: number) => void
  onDelete: (id: string) => void
}

const clockTypeLabels: Record<ClockType, string> = {
  pie: 'Torta',
  bar: 'Barra segmentata',
}

const clockColorLabels: Record<ClockColor, string> = {
  gold: 'Oro',
  ember: 'Brace',
  blood: 'Sangue',
  moss: 'Muschio',
}

export function ClockToken({
  clock,
  boardRef,
  onUpdate,
  onSetFilled,
  onMove,
  onDelete,
}: ClockTokenProps) {
  const beginDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    const boardElement = boardRef.current

    if (clock.locked || clock.pinnedToParty || !boardElement) {
      return
    }

    const boardRect = boardElement.getBoundingClientRect()
    const startX = event.clientX
    const startY = event.clientY
    const initialX = clock.position.x
    const initialY = clock.position.y

    event.currentTarget.setPointerCapture(event.pointerId)

    const handleMove = (moveEvent: PointerEvent) => {
      const nextX = initialX + moveEvent.clientX - startX
      const nextY = initialY + moveEvent.clientY - startY
      onMove(
        clock.id,
        Math.min(Math.max(nextX, 0), boardRect.width - 160),
        Math.min(Math.max(nextY, 0), boardRect.height - 120),
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
      className={`clock-token ${clock.color} ${clock.size} ${
        clock.pinnedToParty ? 'party-pinned' : ''
      }`}
      style={clock.pinnedToParty ? undefined : { left: clock.position.x, top: clock.position.y }}
    >
      <div className="clock-token-topline">
        <button
          type="button"
          className="drag-handle"
          onPointerDown={beginDrag}
          aria-label="Sposta clock"
        >
          <GripHorizontal aria-hidden="true" size={18} />
        </button>
        {clock.pinnedToParty ? <span className="party-chip">Party</span> : null}
        <input
          value={clock.name}
          onChange={(event) => onUpdate(clock.id, { name: event.target.value })}
          aria-label="Nome clock"
        />
        <button
          type="button"
          className="icon-button small"
          onClick={() => onUpdate(clock.id, { locked: !clock.locked })}
          aria-label={clock.locked ? 'Sblocca posizione' : 'Blocca posizione'}
        >
          {clock.locked ? (
            <Lock aria-hidden="true" size={15} />
          ) : (
            <Unlock aria-hidden="true" size={15} />
          )}
        </button>
        <button
          type="button"
          className="icon-button small"
          onClick={() => onUpdate(clock.id, { pinnedToParty: !clock.pinnedToParty })}
          aria-label={clock.pinnedToParty ? 'Libera dalla zona Party' : 'Fissa in Party'}
        >
          {clock.pinnedToParty ? (
            <PinOff aria-hidden="true" size={15} />
          ) : (
            <Pin aria-hidden="true" size={15} />
          )}
        </button>
      </div>

      <div className="clock-visual">
        {clock.type === 'pie' ? (
          <PieClock
            segments={clock.segments}
            filled={clock.filled}
            onSetFilled={(filled) => onSetFilled(clock.id, filled)}
          />
        ) : (
          <SegmentedBarClock
            segments={clock.segments}
            filled={clock.filled}
            onSetFilled={(filled) => onSetFilled(clock.id, filled)}
          />
        )}
      </div>

      <div className="clock-token-actions">
        <button
          type="button"
          className="icon-button small"
          onClick={() => onSetFilled(clock.id, clock.filled - 1)}
          aria-label="Diminuisci avanzamento"
        >
          <Minus aria-hidden="true" size={15} />
        </button>
        <strong>{clock.settings.showValue ? `${clock.filled} / ${clock.segments}` : ''}</strong>
        <button
          type="button"
          className="icon-button small"
          onClick={() => onSetFilled(clock.id, clock.filled + 1)}
          aria-label="Aumenta avanzamento"
        >
          <Plus aria-hidden="true" size={15} />
        </button>
      </div>

      <div className="clock-settings-row clock-settings-primary">
        <label>
          Stile
          <select
            value={clock.type}
            onChange={(event) =>
              onUpdate(clock.id, { type: event.target.value as ClockType })
            }
          >
            {Object.entries(clockTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Segmenti
          <input
            type="number"
            min={2}
            value={clock.segments}
            onChange={(event) =>
              onUpdate(clock.id, { segments: Number(event.target.value) })
            }
          />
        </label>
      </div>

      <div className="clock-settings-row clock-settings-footer">
        <label>
          Colore
          <select
            value={clock.color}
            onChange={(event) =>
              onUpdate(clock.id, { color: event.target.value as ClockColor })
            }
          >
            {Object.entries(clockColorLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="icon-button danger"
          onClick={() => onDelete(clock.id)}
          aria-label="Elimina clock"
        >
          <Trash2 aria-hidden="true" size={16} />
        </button>
      </div>
    </article>
  )
}
