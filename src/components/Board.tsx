import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
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
const SNAP_GAP = 14
const SNAP_DISTANCE = 180
const SNAP_VERTICAL_DISTANCE = 92
const SNAP_MIN_COLUMN_WIDTH = 260
const BOARD_CHILD_SELECTOR =
  ':scope > .clock-token, :scope > .track-token, :scope > .player-card, :scope > .snap-group'

interface MeasuredBoardItem {
  key: string
  boardItem: BoardItem
  x: number
  y: number
  width: number
  height: number
}

type BoardLayoutEntry =
  | {
      kind: 'single'
      item: BoardItem
    }
  | {
      kind: 'group'
      id: string
      items: BoardItem[]
      left: number
      top: number
      width: number
      columns: number
    }

const sizeWidth = {
  small: {
    clock: 220,
    track: 440,
    player: 520,
  },
  medium: {
    clock: 248,
    track: 520,
    player: 620,
  },
  large: {
    clock: 290,
    track: 640,
    player: 760,
  },
}

const getBoardItemKey = (item: BoardItem) => {
  if (item.kind === 'track') {
    return `${item.source}-track:${item.item.id}`
  }

  return `${item.kind}:${item.item.id}`
}

const getBoardItemPosition = (item: BoardItem) => item.item.position

const getBoardItemWidth = (item: BoardItem) => {
  if (item.kind === 'clock') {
    return sizeWidth[item.item.size].clock
  }

  if (item.kind === 'track') {
    return sizeWidth[item.item.size].track
  }

  return sizeWidth[item.item.size].player
}

const getBoardItemHeight = (item: BoardItem) => {
  if (item.kind === 'clock') {
    return item.item.type === 'bar' ? 260 : 330
  }

  if (item.kind === 'track') {
    return 230
  }

  const graphCount = (item.item.tracks?.length ?? 0) + (item.item.clocks?.length ?? 0)

  return 190 + graphCount * 230
}

const toMeasuredBoardItem = (item: BoardItem): MeasuredBoardItem => {
  const position = getBoardItemPosition(item)

  return {
    key: getBoardItemKey(item),
    boardItem: item,
    x: position.x,
    y: position.y,
    width: getBoardItemWidth(item),
    height: getBoardItemHeight(item),
  }
}

const getGap = (startA: number, endA: number, startB: number, endB: number) =>
  Math.max(0, Math.max(startA, startB) - Math.min(endA, endB))

const shouldSnapTogether = (left: MeasuredBoardItem, right: MeasuredBoardItem) => {
  const horizontalGap = getGap(left.x, left.x + left.width, right.x, right.x + right.width)
  const verticalGap = getGap(left.y, left.y + left.height, right.y, right.y + right.height)

  return horizontalGap <= SNAP_DISTANCE && verticalGap <= SNAP_VERTICAL_DISTANCE
}

const getMaxSnapColumns = (boardWidth: number) => {
  if (boardWidth <= 560) {
    return 1
  }

  if (boardWidth <= 860) {
    return 2
  }

  return 3
}

const buildBoardLayout = (
  items: BoardItem[],
  boardWidth: number,
  draggingKey: string | null,
): BoardLayoutEntry[] => {
  const measuredItems = items.map(toMeasuredBoardItem)
  const sortedItems = [...measuredItems].sort(
    (left, right) => left.y - right.y || left.x - right.x,
  )
  const groupedKeys = new Set<string>()
  const entries: BoardLayoutEntry[] = []

  for (const item of sortedItems) {
    if (groupedKeys.has(item.key)) {
      continue
    }

    if (item.key === draggingKey) {
      groupedKeys.add(item.key)
      entries.push({ kind: 'single', item: item.boardItem })
      continue
    }

    const group: MeasuredBoardItem[] = []
    const queue = [item]

    groupedKeys.add(item.key)

    while (queue.length > 0) {
      const current = queue.shift()

      if (!current) {
        continue
      }

      group.push(current)

      for (const candidate of sortedItems) {
        if (groupedKeys.has(candidate.key) || candidate.key === draggingKey) {
          continue
        }

        if (shouldSnapTogether(current, candidate)) {
          groupedKeys.add(candidate.key)
          queue.push(candidate)
        }
      }
    }

    if (group.length === 1) {
      entries.push({ kind: 'single', item: item.boardItem })
      continue
    }

    const groupItems = [...group].sort((left, right) => left.y - right.y || left.x - right.x)
    const left = Math.min(...groupItems.map((groupItem) => groupItem.x))
    const top = Math.min(...groupItems.map((groupItem) => groupItem.y))
    const maxResponsiveColumns = getMaxSnapColumns(boardWidth)
    const widestItem = Math.max(...groupItems.map((groupItem) => groupItem.width))
    const availableWidth = boardWidth > 0 ? Math.max(220, boardWidth - left - 16) : widestItem
    const maxColumnsByWidth = Math.max(
      1,
      Math.floor((availableWidth + SNAP_GAP) / (SNAP_MIN_COLUMN_WIDTH + SNAP_GAP)),
    )
    const columns = Math.min(groupItems.length, maxResponsiveColumns, maxColumnsByWidth)
    const naturalWidth = widestItem * columns + SNAP_GAP * (columns - 1)

    entries.push({
      kind: 'group',
      id: groupItems.map((groupItem) => groupItem.key).join('|'),
      items: groupItems.map((groupItem) => groupItem.boardItem),
      left,
      top,
      width: Math.min(naturalWidth, availableWidth),
      columns,
    })
  }

  return entries
}

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
  const [boardWidth, setBoardWidth] = useState(0)
  const [boardMinHeight, setBoardMinHeight] = useState(620)
  const [draggingKey, setDraggingKey] = useState<string | null>(null)
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
  const boardLayout = buildBoardLayout(boardItems, boardWidth, draggingKey)
  const isBoardEmpty = boardItems.length === 0

  useEffect(() => {
    const board = boardRef.current

    if (!board) {
      return
    }

    const updateBoardMetrics = () => {
      const boardRect = board.getBoundingClientRect()
      const childBottoms = Array.from(board.querySelectorAll(BOARD_CHILD_SELECTOR)).map(
        (child) => {
          const childRect = child.getBoundingClientRect()

          return childRect.bottom - boardRect.top
        },
      )
      const nextWidth = Math.round(boardRect.width)
      const nextMinHeight = Math.max(620, Math.ceil(Math.max(0, ...childBottoms) + 28))

      setBoardWidth((currentWidth) =>
        currentWidth === nextWidth ? currentWidth : nextWidth,
      )
      setBoardMinHeight((currentHeight) =>
        currentHeight === nextMinHeight ? currentHeight : nextMinHeight,
      )
    }

    const frameId = window.requestAnimationFrame(updateBoardMetrics)
    const resizeObserver = new ResizeObserver(updateBoardMetrics)

    resizeObserver.observe(board)
    Array.from(board.children).forEach((child) => resizeObserver.observe(child))
    window.addEventListener('resize', updateBoardMetrics)

    return () => {
      window.cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateBoardMetrics)
    }
  })

  const renderBoardItem = (boardItem: BoardItem, layout: 'free' | 'grid') => {
    const dragKey = getBoardItemKey(boardItem)
    const dragHandlers = {
      onDragStart: () => setDraggingKey(dragKey),
      onDragEnd: () => setDraggingKey(null),
    }

    if (boardItem.kind === 'clock') {
      const clock = boardItem.item

      return (
        <ClockToken
          key={clock.id}
          clock={clock}
          boardRef={boardRef}
          layout={layout}
          onUpdate={onUpdateClock}
          onSetFilled={onSetClockFilled}
          onMove={onMoveClock}
          onDelete={onDeleteClock}
          {...dragHandlers}
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
          layout={layout}
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
          {...dragHandlers}
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
        layout={layout}
        canDelete={!isInitialTrack}
        onUpdate={isInitialTrack ? onUpdateTrack : onUpdateBoardTrack}
        onMove={isInitialTrack ? onMoveTrack : onMoveBoardTrack}
        onDelete={isInitialTrack ? () => undefined : onDeleteBoardTrack}
        onTogglePinnedTop={(id) =>
          isInitialTrack
            ? onUpdateTrack(id, { pinnedToTop: true })
            : onUpdateBoardTrack(id, { pinnedToTop: true })
        }
        {...dragHandlers}
      />
    )
  }

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

        {boardLayout.map((layoutEntry) => {
          if (layoutEntry.kind === 'single') {
            return renderBoardItem(layoutEntry.item, 'free')
          }

          const style = {
            '--snap-columns': layoutEntry.columns,
            left: layoutEntry.left,
            top: layoutEntry.top,
            width: layoutEntry.width,
          } as CSSProperties

          return (
            <div className="snap-group" key={layoutEntry.id} style={style}>
              {layoutEntry.items.map((boardItem) => renderBoardItem(boardItem, 'grid'))}
            </div>
          )
        })}
      </div>
    </main>
  )
}
