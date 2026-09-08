import { GripHorizontal, Lock, Plus, Trash2, Unlock } from 'lucide-react'
import { useState } from 'react'
import type { RefObject } from 'react'
import type { PlayerCard as PlayerCardType, PlayerTrack } from '../types/campaign'
import { TrackSquares } from './TrackSquares'

interface PlayerCardProps {
  playerCard: PlayerCardType
  boardRef: RefObject<HTMLDivElement | null>
  onUpdate: (id: string, patch: Partial<PlayerCardType>) => void
  onMove: (id: string, x: number, y: number) => void
  onDelete: (id: string) => void
  onAddTrack: (playerId: string, track: PlayerTrack) => void
  onUpdateTrack: (playerId: string, trackId: string, patch: Partial<PlayerTrack>) => void
  onDeleteTrack: (playerId: string, trackId: string) => void
}

const normalizeRange = (value: number) => Math.max(1, Math.round(value) || 1)

export function PlayerCard({
  playerCard,
  boardRef,
  onUpdate,
  onMove,
  onDelete,
  onAddTrack,
  onUpdateTrack,
  onDeleteTrack,
}: PlayerCardProps) {
  const [isAddingTrack, setIsAddingTrack] = useState(false)
  const [draftLabel, setDraftLabel] = useState('Atteggiamento verso popolazione')
  const [draftRange, setDraftRange] = useState(20)

  const beginDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    const boardElement = boardRef.current

    if (playerCard.locked || !boardElement) {
      return
    }

    const boardRect = boardElement.getBoundingClientRect()
    const tokenRect = event.currentTarget.closest('.player-card')?.getBoundingClientRect()
    const startX = event.clientX
    const startY = event.clientY
    const initialX = playerCard.position.x
    const initialY = playerCard.position.y

    event.currentTarget.setPointerCapture(event.pointerId)

    const handleMove = (moveEvent: PointerEvent) => {
      const nextX = initialX + moveEvent.clientX - startX
      const nextY = initialY + moveEvent.clientY - startY

      onMove(
        playerCard.id,
        Math.min(Math.max(nextX, 0), boardRect.width - (tokenRect?.width ?? 280)),
        Math.min(Math.max(nextY, 0), boardRect.height - (tokenRect?.height ?? 160)),
      )
    }

    const handleUp = () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
  }

  const createTrack = () => {
    const range = normalizeRange(draftRange)
    const now = new Date().toISOString()

    onAddTrack(playerCard.id, {
      id: `player-track-${Date.now()}`,
      name: draftLabel.trim() || 'Grafico giocatore',
      graphLabel: draftLabel.trim() || 'Grafico giocatore',
      leftLabel: `-${range}`,
      centerLabel: '0',
      rightLabel: `+${range}`,
      min: -range,
      max: range,
      value: 0,
      updatedAt: now,
    })
    setIsAddingTrack(false)
    setDraftLabel('Atteggiamento verso popolazione')
    setDraftRange(20)
  }

  const updateTrackRange = (track: PlayerTrack, value: number) => {
    const range = normalizeRange(value)

    onUpdateTrack(playerCard.id, track.id, {
      min: -range,
      max: range,
      leftLabel: `-${range}`,
      rightLabel: `+${range}`,
    })
  }

  return (
    <article
      className={`player-card ${playerCard.size}`}
      style={{ left: playerCard.position.x, top: playerCard.position.y }}
    >
      <div className="player-card-topline">
        <button
          type="button"
          className="drag-handle"
          onPointerDown={beginDrag}
          aria-label="Sposta giocatore"
        >
          <GripHorizontal aria-hidden="true" size={18} />
        </button>
        <input
          value={playerCard.playerName}
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
            createTrack()
          }}
        >
          <label>
            Label
            <input value={draftLabel} onChange={(event) => setDraftLabel(event.target.value)} />
          </label>
          <label>
            X
            <input
              type="number"
              min={1}
              value={draftRange}
              onChange={(event) => setDraftRange(normalizeRange(Number(event.target.value)))}
            />
          </label>
          <button type="submit" className="plank-button primary">
            Crea
          </button>
        </form>
      ) : null}

      {playerCard.tracks.length === 0 ? (
        <p className="player-card-empty">Nessun grafico per questo giocatore.</p>
      ) : (
        <div className="player-track-list">
          {playerCard.tracks.map((track) => {
            const range = Math.max(Math.abs(track.min), Math.abs(track.max))

            return (
              <section className="player-track" key={track.id}>
                <input
                  className="graph-label-input"
                  value={track.graphLabel || track.name}
                  onChange={(event) =>
                    onUpdateTrack(playerCard.id, track.id, {
                      name: event.target.value,
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
                    <span>{track.leftLabel}</span>
                    <strong>{track.value > 0 ? `+${track.value}` : track.value}</strong>
                    <span>{track.rightLabel}</span>
                  </div>
                  <label>
                    X
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
