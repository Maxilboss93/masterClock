import { useRef } from 'react'
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

type BoardItem =
  | {
      kind: 'track'
      source: 'initial'
      item: BoardTrack
    }
  | {
      kind: 'track'
      source: 'custom'
      item: BoardTrack
    }
  | {
      kind: 'player'
      item: PlayerCardType
    }
  | {
      kind: 'clock'
      item: Clock
    }

const getBoardItemDate = (item: BoardItem) =>
  item.item.createdAt ?? item.item.updatedAt

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
  const partyClocks = clocks.filter((clock) => clock.pinnedToParty)
  const freeClocks = clocks.filter((clock) => !clock.pinnedToParty)
  const freeTracks = tracks.filter((track) => !track.pinnedToTop)
  const freeBoardTracks = boardTracks.filter((track) => !track.pinnedToTop)
  const boardItems: BoardItem[] = [
    ...freeTracks.map((track) => ({
      kind: 'track' as const,
      source: 'initial' as const,
      item: track,
    })),
    ...freeBoardTracks.map((track) => ({
      kind: 'track' as const,
      source: 'custom' as const,
      item: track,
    })),
    ...playerCards.map((playerCard) => ({
      kind: 'player' as const,
      item: playerCard,
    })),
    ...freeClocks.map((clock) => ({ kind: 'clock' as const, item: clock })),
  ].sort((left, right) =>
    getBoardItemDate(left).localeCompare(getBoardItemDate(right)),
  )
  const isBoardEmpty = boardItems.length === 0

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
            <span>Aggiungi un grafico quando il mondo inizia a muoversi.</span>
          </div>
        ) : null}

        <div className="board-grid">
          {boardItems.map((boardItem) => {
            if (boardItem.kind === 'clock') {
              const clock = boardItem.item

              return (
                <ClockToken
                  key={clock.id}
                  clock={clock}
                  boardRef={boardRef}
                  layout="grid"
                  onUpdate={onUpdateClock}
                  onSetFilled={onSetClockFilled}
                  onMove={onMoveClock}
                  onDelete={onDeleteClock}
                />
              )
            }

            if (boardItem.kind === 'player') {
              const playerCard = boardItem.item

              return (
                <PlayerCard
                  key={playerCard.id}
                  playerCard={playerCard}
                  boardRef={boardRef}
                  layout="grid"
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
              )
            }

            const track = boardItem.item
            const isInitialTrack = boardItem.source === 'initial'

            return (
              <TrackToken
                key={track.id}
                track={track}
                boardRef={boardRef}
                layout="grid"
                canDelete={!isInitialTrack}
                onUpdate={isInitialTrack ? onUpdateTrack : onUpdateBoardTrack}
                onMove={isInitialTrack ? onMoveTrack : onMoveBoardTrack}
                onDelete={isInitialTrack ? () => undefined : onDeleteBoardTrack}
                onTogglePinnedTop={(id) =>
                  isInitialTrack
                    ? onUpdateTrack(id, { pinnedToTop: true })
                    : onUpdateBoardTrack(id, { pinnedToTop: true })
                }
              />
            )
          })}
        </div>
      </div>
    </main>
  )
}
