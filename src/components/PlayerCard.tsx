import { GripHorizontal, Lock, Minus, Plus, Trash2, Unlock } from 'lucide-react'
import { useState } from 'react'
import type { RefObject } from 'react'
import { normalizeSegmentCount } from '../state/numbers'
import type {
  ClockColor,
  PlayerCard as PlayerCardType,
  PlayerClock,
  PlayerTrack,
} from '../types/campaign'
import { PieClock } from './PieClock'
import { SegmentedBarClock } from './SegmentedBarClock'
import { TrackSquares } from './TrackSquares'

interface PlayerCardProps {
  playerCard: PlayerCardType
  boardRef: RefObject<HTMLDivElement | null>
  layout?: 'free' | 'grid'
  onUpdate: (id: string, patch: Partial<PlayerCardType>) => void
  onMove: (id: string, x: number, y: number) => void
  onDelete: (id: string) => void
  onAddTrack: (playerId: string, track: PlayerTrack) => void
  onUpdateTrack: (playerId: string, trackId: string, patch: Partial<PlayerTrack>) => void
  onDeleteTrack: (playerId: string, trackId: string) => void
  onAddClock: (playerId: string, clock: PlayerClock) => void
  onUpdateClock: (playerId: string, clockId: string, patch: Partial<PlayerClock>) => void
  onSetClockFilled: (playerId: string, clockId: string, filled: number) => void
  onDeleteClock: (playerId: string, clockId: string) => void
  onDragStart?: () => void
  onDragEnd?: () => void
}

type PlayerGraphDraftKind = 'clock' | 'track' | 'segmented'

const normalizeRange = (value: number) => Math.max(1, Math.round(value) || 1)
const segmentPresets = [4, 6, 8, 10, 12]

const clockColorLabels: Record<ClockColor, string> = {
  gold: 'Oro',
  ember: 'Brace',
  blood: 'Sangue',
  moss: 'Muschio',
}

export function PlayerCard({
  playerCard,
  boardRef,
  layout = 'free',
  onUpdate,
  onMove,
  onDelete,
  onAddTrack,
  onUpdateTrack,
  onDeleteTrack,
  onAddClock,
  onUpdateClock,
  onSetClockFilled,
  onDeleteClock,
  onDragStart,
  onDragEnd,
}: PlayerCardProps) {
  const cardClassName = [
    'player-card',
    playerCard.size,
    layout === 'grid' ? 'grid-item' : '',
  ].join(' ')
  const [isAddingTrack, setIsAddingTrack] = useState(false)
  const [draftKind, setDraftKind] = useState<PlayerGraphDraftKind>('track')
  const [draftName, setDraftName] = useState('')
  const [draftLabel, setDraftLabel] = useState('')
  const [draftRange, setDraftRange] = useState(20)
  const [draftSegments, setDraftSegments] = useState(6)
  const [draftColor, setDraftColor] = useState<ClockColor>('gold')

  const playerTracks = playerCard.tracks ?? []
  const playerClocks = playerCard.clocks ?? []

  const beginDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    const boardElement = boardRef.current
    const tokenRect = event.currentTarget.closest('.player-card')?.getBoundingClientRect()

    if (playerCard.locked || !boardElement || !tokenRect) {
      return
    }

    const boardRect = boardElement.getBoundingClientRect()
    const startX = event.clientX
    const startY = event.clientY
    const initialX =
      layout === 'grid' ? tokenRect.left - boardRect.left : playerCard.position.x
    const initialY =
      layout === 'grid' ? tokenRect.top - boardRect.top : playerCard.position.y

    event.currentTarget.setPointerCapture(event.pointerId)
    onMove(playerCard.id, initialX, initialY)
    onDragStart?.()

    const handleMove = (moveEvent: PointerEvent) => {
      const nextX = initialX + moveEvent.clientX - startX
      const nextY = initialY + moveEvent.clientY - startY

      onMove(
        playerCard.id,
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

  const resetDraft = () => {
    setIsAddingTrack(false)
    setDraftKind('track')
    setDraftName('')
    setDraftLabel('')
    setDraftRange(20)
    setDraftSegments(6)
    setDraftColor('gold')
  }

  const createGraph = () => {
    const now = new Date().toISOString()

    if (draftKind === 'track') {
      const range = normalizeRange(draftRange)
      const title = draftName.trim() || 'Nuova barra giocatore'
      const label = draftLabel.trim() || title

      onAddTrack(playerCard.id, {
        id: `player-track-${Date.now()}`,
        name: title,
        graphLabel: label,
        leftLabel: `-${range}`,
        centerLabel: '0',
        rightLabel: `+${range}`,
        min: -range,
        max: range,
        value: 0,
        createdAt: now,
        updatedAt: now,
      })
      resetDraft()
      return
    }

    const isSegmented = draftKind === 'segmented'
    const title = draftName.trim() || (isSegmented ? 'Nuova barra segmentata' : 'Nuovo clock')
    const label = draftLabel.trim() || title
    const segments = normalizeSegmentCount(draftSegments)

    onAddClock(playerCard.id, {
      id: `player-clock-${Date.now()}`,
      type: isSegmented ? 'bar' : 'pie',
      name: title,
      graphLabel: label,
      segments,
      filled: 0,
      color: draftColor,
      settings: {
        showValue: true,
        showControls: true,
      },
      createdAt: now,
      updatedAt: now,
    })
    resetDraft()
  }

  const updateTrackRange = (track: PlayerTrack, value: number) => {
    const range = normalizeRange(value)

    onUpdateTrack(playerCard.id, track.id, {
      name: track.name,
      min: -range,
      max: range,
      leftLabel: `-${range}`,
      rightLabel: `+${range}`,
    })
  }

  const graphItems = [
    ...playerTracks.map((track) => ({
      kind: 'track' as const,
      createdAt: track.createdAt ?? track.updatedAt,
      item: track,
    })),
    ...playerClocks.map((clock) => ({
      kind: 'clock' as const,
      createdAt: clock.createdAt ?? clock.updatedAt,
      item: clock,
    })),
  ].sort((left, right) => left.createdAt.localeCompare(right.createdAt))

  return (
    <article
      className={cardClassName}
      style={
        layout === 'free'
          ? { left: playerCard.position.x, top: playerCard.position.y }
          : undefined
      }
    >
      <div className="player-card-topline">
        <button
          type="button"
          className="drag-handle"
          onPointerDown={beginDrag}
          aria-label={layout === 'grid' ? 'Sposta giocatore agganciato' : 'Sposta giocatore'}
        >
          <GripHorizontal aria-hidden="true" size={18} />
        </button>
        <input
          value={playerCard.playerName}
          placeholder="Nome giocatore"
          onChange={(event) => onUpdate(playerCard.id, { playerName: event.target.value })}
          aria-label="Nome giocatore"
        />
        <button
          type="button"
          className="icon-button small"
          onClick={() => onUpdate(playerCard.id, { locked: !playerCard.locked })}
          aria-label={playerCard.locked ? 'Sblocca posizione' : 'Blocca posizione'}
        >
          {playerCard.locked ? (
            <Lock aria-hidden="true" size={15} />
          ) : (
            <Unlock aria-hidden="true" size={15} />
          )}
        </button>
        <button
          type="button"
          className="icon-button danger"
          onClick={() => onDelete(playerCard.id)}
          aria-label="Elimina giocatore"
        >
          <Trash2 aria-hidden="true" size={16} />
        </button>
      </div>

      <button
        type="button"
        className="plank-button player-add-button"
        onClick={() => setIsAddingTrack(true)}
      >
        <Plus aria-hidden="true" size={16} />
        Aggiungi
      </button>

      {isAddingTrack ? (
        <form
          className="player-track-form"
          onSubmit={(event) => {
            event.preventDefault()
            createGraph()
          }}
        >
          <label>
            Tipo grafico
            <select
              value={draftKind}
              onChange={(event) => setDraftKind(event.target.value as PlayerGraphDraftKind)}
            >
              <option value="clock">Clock</option>
              <option value="track">Barra -X / 0 / +X</option>
              <option value="segmented">Barra segmentata</option>
            </select>
          </label>
          <label>
            Titolo grafico
            <input
              value={draftName}
              placeholder={
                draftKind === 'track'
                  ? 'es. Fiducia di Shisui'
                  : draftKind === 'segmented'
                    ? 'es. Ferite aperte'
                    : 'es. Patto in bilico'
              }
              onChange={(event) => setDraftName(event.target.value)}
            />
          </label>
          <label>
            Label grafico
            <input
              value={draftLabel}
              placeholder={
                draftKind === 'track'
                  ? 'es. Atteggiamento verso popolazione'
                  : draftKind === 'segmented'
                    ? 'es. Caselle riempite'
                    : 'es. Rintocchi personali'
              }
              onChange={(event) => setDraftLabel(event.target.value)}
            />
          </label>
          {draftKind === 'track' ? (
            <label>
              Ampiezza X
              <input
                type="number"
                min={1}
                value={draftRange}
                onChange={(event) => setDraftRange(normalizeRange(Number(event.target.value)))}
              />
            </label>
          ) : (
            <>
              <fieldset>
                <legend>{draftKind === 'segmented' ? 'Caselle' : 'Segmenti'}</legend>
                <div className="preset-row compact">
                  {segmentPresets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      className={preset === draftSegments ? 'preset active' : 'preset'}
                      onClick={() => setDraftSegments(preset)}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min={2}
                  value={draftSegments}
                  onChange={(event) =>
                    setDraftSegments(normalizeSegmentCount(Number(event.target.value)))
                  }
                />
              </fieldset>
              <label>
                Colore
                <select
                  value={draftColor}
                  onChange={(event) => setDraftColor(event.target.value as ClockColor)}
                >
                  {Object.entries(clockColorLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </>
          )}
          <button type="submit" className="plank-button primary">
            Crea
          </button>
        </form>
      ) : null}

      {graphItems.length === 0 ? (
        <p className="player-card-empty">Nessun grafico per questo giocatore.</p>
      ) : (
        <div className="player-track-list">
          {graphItems.map((graphItem) => {
            if (graphItem.kind === 'clock') {
              const clock = graphItem.item

              return (
                <section className={`player-track player-clock ${clock.color}`} key={clock.id}>
                  <input
                    className="player-graph-title-input"
                    value={clock.name}
                    placeholder="Titolo grafico"
                    onChange={(event) =>
                      onUpdateClock(playerCard.id, clock.id, { name: event.target.value })
                    }
                    aria-label="Titolo grafico giocatore"
                  />
                  <input
                    className="graph-label-input"
                    value={clock.graphLabel || clock.name}
                    placeholder="Label grafico"
                    onChange={(event) =>
                      onUpdateClock(playerCard.id, clock.id, { graphLabel: event.target.value })
                    }
                    aria-label="Label grafico giocatore"
                  />

                  <div className="clock-visual">
                    {clock.type === 'pie' ? (
                      <PieClock
                        segments={clock.segments}
                        filled={clock.filled}
                        onSetFilled={(filled) =>
                          onSetClockFilled(playerCard.id, clock.id, filled)
                        }
                      />
                    ) : (
                      <SegmentedBarClock
                        segments={clock.segments}
                        filled={clock.filled}
                        onSetFilled={(filled) =>
                          onSetClockFilled(playerCard.id, clock.id, filled)
                        }
                      />
                    )}
                  </div>

                  <div className="player-track-controls">
                    <div className="clock-token-actions">
                      <button
                        type="button"
                        className="icon-button small"
                        onClick={() => onSetClockFilled(playerCard.id, clock.id, clock.filled - 1)}
                        aria-label="Diminuisci avanzamento"
                      >
                        <Minus aria-hidden="true" size={15} />
                      </button>
                      <strong>{clock.filled} / {clock.segments}</strong>
                      <button
                        type="button"
                        className="icon-button small"
                        onClick={() => onSetClockFilled(playerCard.id, clock.id, clock.filled + 1)}
                        aria-label="Aumenta avanzamento"
                      >
                        <Plus aria-hidden="true" size={15} />
                      </button>
                    </div>
                    <label>
                      {clock.type === 'bar' ? 'Caselle' : 'Segmenti'}
                      <input
                        type="number"
                        min={2}
                        value={clock.segments}
                        onChange={(event) =>
                          onUpdateClock(playerCard.id, clock.id, {
                            segments: Number(event.target.value),
                          })
                        }
                      />
                    </label>
                    <button
                      type="button"
                      className="icon-button danger"
                      onClick={() => onDeleteClock(playerCard.id, clock.id)}
                      aria-label="Elimina grafico giocatore"
                    >
                      <Trash2 aria-hidden="true" size={16} />
                    </button>
                  </div>
                </section>
              )
            }

            const track = graphItem.item
            const range = Math.max(Math.abs(track.min), Math.abs(track.max))

            return (
              <section className="player-track" key={track.id}>
                <input
                  className="player-graph-title-input"
                  value={track.name}
                  placeholder="Titolo grafico"
                  onChange={(event) =>
                    onUpdateTrack(playerCard.id, track.id, {
                      name: event.target.value,
                    })
                  }
                  aria-label="Titolo grafico giocatore"
                />
                <input
                  className="graph-label-input"
                  value={track.graphLabel || track.name}
                  placeholder="Label grafico"
                  onChange={(event) =>
                    onUpdateTrack(playerCard.id, track.id, {
                      graphLabel: event.target.value,
                    })
                  }
                  aria-label="Label grafico giocatore"
                />

                <TrackSquares
                  track={track}
                  onValueChange={(value) =>
                    onUpdateTrack(playerCard.id, track.id, { value })
                  }
                />

                <div className="player-track-controls">
                  <div className="track-label-row player-track-labels">
                    <span>
                      <strong>{track.min}</strong>
                      {track.leftLabel !== String(track.min) ? track.leftLabel : null}
                    </span>
                    <strong>{track.value > 0 ? `+${track.value}` : track.value}</strong>
                    <span>
                      {track.rightLabel !== `+${track.max}` && track.rightLabel !== String(track.max)
                        ? track.rightLabel
                        : null}
                      <strong>{track.max > 0 ? `+${track.max}` : track.max}</strong>
                    </span>
                  </div>
                  <label>
                    Ampiezza X
                    <input
                      type="number"
                      min={1}
                      value={range}
                      onChange={(event) => updateTrackRange(track, Number(event.target.value))}
                    />
                  </label>
                  <button
                    type="button"
                    className="icon-button danger"
                    onClick={() => onDeleteTrack(playerCard.id, track.id)}
                    aria-label="Elimina grafico giocatore"
                  >
                    <Trash2 aria-hidden="true" size={16} />
                  </button>
                </div>
              </section>
            )
          })}
        </div>
      )}
    </article>
  )
}
