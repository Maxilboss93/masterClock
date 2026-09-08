import { useEffect, useRef, useState } from 'react'
import type {
  BoardTrack,
  Clock,
  PlayerCard as PlayerCardType,
  PlayerClock,
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
  onAddPlayerClock: (playerId: string, clock: PlayerClock) => void
  onUpdatePlayerClock: (playerId: string, clockId: string, patch: Partial<PlayerClock>) => void
  onSetPlayerClockFilled: (playerId: string, clockId: string, filled: number) => void
  onDeletePlayerClock: (playerId: string, clockId: string) => void
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
  onAddPlayerClock,
  onUpdatePlayerClock,
  onSetPlayerClockFilled,
  onDeletePlayerClock,
}: BoardProps) {
  const boardRef = useRef<HTMLDivElement | null>(null)
  const [boardMinHeight, setBoardMinHeight] = useState(620)
  const partyClocks = clocks.filter((clock) => clock.pinnedToParty)
  const freeClocks = clocks.filter((clock) => !clock.pinnedToParty)
  const freeTracks = tracks.filter((track) => !track.pinnedToTop)
  const freeBoardTracks = boardTracks.filter((track) => !track.pinnedToTop)
  const isBoardEmpty =
    freeClocks.length === 0 &&
    freeTracks.length === 0 &&
    freeBoardTracks.length === 0 &&
    playerCards.length === 0

  useEffect(() => {
    const board = boardRef.current

    if (!board) {
      return
    }

    const updateBoardHeight = () => {
      const boardTop = board.getBoundingClientRect().top
      const childBottoms = Array.from(board.children).map((child) =>
        child.getBoundingClientRect().bottom - boardTop,
      )
      const nextHeight = Math.max(620, Math.ceil(Math.max(0, ...childBottoms) + 28))

      setBoardMinHeight(nextHeight)
    }

    const frameId = window.requestAnimationFrame(updateBoardHeight)
    const resizeObserver = new ResizeObserver(updateBoardHeight)

    Array.from(board.children).forEach((child) => resizeObserver.observe(child))
    window.addEventListener('resize', updateBoardHeight)

    return () => {
      window.cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateBoardHeight)
    }
  }, [freeClocks, freeTracks, freeBoardTracks, playerCards])

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

      <div className="board" ref={boardRef} style={{ minHeight: boardMinHeight }}>
        {isBoardEmpty ? (
          <div className="board-empty">
            <p>La plancia e vuota.</p>
            <span>Aggiungi un grafico quando il mondo inizia a muoversi.</span>
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
            onAddClock={onAddPlayerClock}
            onUpdateClock={onUpdatePlayerClock}
            onSetClockFilled={onSetPlayerClockFilled}
            onDeleteClock={onDeletePlayerClock}
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
