import { useRef } from 'react'
import type { BoardTrack, Clock } from '../types/campaign'
import { ClockToken } from './ClockToken'
import { TrackToken } from './TrackToken'

interface BoardProps {
  clocks: Clock[]
  boardTracks: BoardTrack[]
  onUpdateClock: (id: string, patch: Partial<Clock>) => void
  onSetClockFilled: (id: string, filled: number) => void
  onMoveClock: (id: string, x: number, y: number) => void
  onDeleteClock: (id: string) => void
  onUpdateBoardTrack: (id: string, patch: Partial<BoardTrack>) => void
  onMoveBoardTrack: (id: string, x: number, y: number) => void
  onDeleteBoardTrack: (id: string) => void
}

export function Board({
  clocks,
  boardTracks,
  onUpdateClock,
  onSetClockFilled,
  onMoveClock,
  onDeleteClock,
  onUpdateBoardTrack,
  onMoveBoardTrack,
  onDeleteBoardTrack,
}: BoardProps) {
  const boardRef = useRef<HTMLDivElement | null>(null)
  const partyClocks = clocks.filter((clock) => clock.pinnedToParty)
  const freeClocks = clocks.filter((clock) => !clock.pinnedToParty)
  const isBoardEmpty = freeClocks.length === 0 && boardTracks.length === 0

  return (
    <main className="board-shell">
      {partyClocks.length > 0 ? (
        <section className="party-rail" aria-label="Clock globali Party">
          <h2>Party</h2>
          <div className="party-clock-list">
            {partyClocks.map((clock) => (
              <ClockToken
                key={clock.id}
                clock={clock}
                boardRef={boardRef}
                onUpdate={onUpdateClock}
                onSetFilled={onSetClockFilled}
                onMove={onMoveClock}
                onDelete={onDeleteClock}
              />
            ))}
          </div>
        </section>
      ) : null}

      <div className="board" ref={boardRef}>
        {isBoardEmpty ? (
          <div className="board-empty">
            <p>La plancia e vuota.</p>
            <span>Aggiungi un clock o una barra quando il mondo inizia a muoversi.</span>
          </div>
        ) : null}

        {boardTracks.map((track) => (
          <TrackToken
            key={track.id}
            track={track}
            boardRef={boardRef}
            onUpdate={onUpdateBoardTrack}
            onMove={onMoveBoardTrack}
            onDelete={onDeleteBoardTrack}
          />
        ))}

        {freeClocks.map((clock) => (
          <ClockToken
            key={clock.id}
            clock={clock}
            boardRef={boardRef}
            onUpdate={onUpdateClock}
            onSetFilled={onSetClockFilled}
            onMove={onMoveClock}
            onDelete={onDeleteClock}
          />
        ))}
      </div>
    </main>
  )
}
