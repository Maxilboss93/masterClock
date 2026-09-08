import { useRef } from 'react'
import type {
  BoardTrack,
  Clock,
  PlayerCard as PlayerCardType,
  PlayerTrack,
} from '../types/campaign'
import { ClockToken } from './ClockToken'
import { PlayerCard } from './PlayerCard'
import { TrackToken } from './TrackToken'

interface BoardProps {
  tracks: BoardTrack[]
  clocks: Clock[]
  boardTracks: BoardTrack[]
  playerCards: PlayerCardType[]
  onUpdateTrack: (id: string, patch: Partial<BoardTrack>) => void
  onMoveTrack: (id: string, x: number, y: number) => void
  onUpdateClock: (id: string, patch: Partial<Clock>) => void
  onSetClockFilled: (id: string, filled: number) => void
  onMoveClock: (id: string, x: number, y: number) => void
  onDeleteClock: (id: string) => void
  onUpdateBoardTrack: (id: string, patch: Partial<BoardTrack>) => void
  onMoveBoardTrack: (id: string, x: number, y: number) => void
  onDeleteBoardTrack: (id: string) => void
  onUpdatePlayerCard: (id: string, patch: Partial<PlayerCardType>) => void
  onMovePlayerCard: (id: string, x: number, y: number) => void
  onDeletePlayerCard: (id: string) => void
  onAddPlayerTrack: (playerId: string, track: PlayerTrack) => void
  onUpdatePlayerTrack: (playerId: string, trackId: string, patch: Partial<PlayerTrack>) => void
  onDeletePlayerTrack: (playerId: string, trackId: string) => void
}

export function Board({
  tracks,
  clocks,
  boardTracks,
  playerCards,
  onUpdateTrack,
  onMoveTrack,
  onUpdateClock,
  onSetClockFilled,
  onMoveClock,
  onDeleteClock,
  onUpdateBoardTrack,
  onMoveBoardTrack,
  onDeleteBoardTrack,
  onUpdatePlayerCard,
  onMovePlayerCard,
  onDeletePlayerCard,
  onAddPlayerTrack,
  onUpdatePlayerTrack,
  onDeletePlayerTrack,
}: BoardProps) {
  const boardRef = useRef<HTMLDivElement | null>(null)
  const partyClocks = clocks.filter((clock) => clock.pinnedToParty)
  const freeClocks = clocks.filter((clock) => !clock.pinnedToParty)
  const freeTracks = tracks.filter((track) => !track.pinnedToTop)
  const freeBoardTracks = boardTracks.filter((track) => !track.pinnedToTop)
  const isBoardEmpty =
    freeClocks.length === 0 &&
    freeTracks.length === 0 &&
    freeBoardTracks.length === 0 &&
    playerCards.length === 0

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

        {freeTracks.map((track) => (
          <TrackToken
            key={track.id}
            track={track}
            boardRef={boardRef}
            canDelete={false}
            onUpdate={onUpdateTrack}
            onMove={onMoveTrack}
            onDelete={() => undefined}
            onTogglePinnedTop={(id) =>
              onUpdateTrack(id, { pinnedToTop: true })
            }
          />
        ))}

        {freeBoardTracks.map((track) => (
          <TrackToken
            key={track.id}
            track={track}
            boardRef={boardRef}
            onUpdate={onUpdateBoardTrack}
            onMove={onMoveBoardTrack}
            onDelete={onDeleteBoardTrack}
            onTogglePinnedTop={(id) =>
              onUpdateBoardTrack(id, { pinnedToTop: true })
            }
          />
        ))}

        {playerCards.map((playerCard) => (
          <PlayerCard
            key={playerCard.id}
            playerCard={playerCard}
            boardRef={boardRef}
            onUpdate={onUpdatePlayerCard}
            onMove={onMovePlayerCard}
            onDelete={onDeletePlayerCard}
            onAddTrack={onAddPlayerTrack}
            onUpdateTrack={onUpdatePlayerTrack}
            onDeleteTrack={onDeletePlayerTrack}
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
