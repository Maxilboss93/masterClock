import { useRef } from 'react'
import type { Clock } from '../types/campaign'
import { ClockToken } from './ClockToken'

interface BoardProps {
  clocks: Clock[]
  onUpdateClock: (id: string, patch: Partial<Clock>) => void
  onSetClockFilled: (id: string, filled: number) => void
  onMoveClock: (id: string, x: number, y: number) => void
  onDeleteClock: (id: string) => void
}

export function Board({
  clocks,
  onUpdateClock,
  onSetClockFilled,
  onMoveClock,
  onDeleteClock,
}: BoardProps) {
  const boardRef = useRef<HTMLDivElement | null>(null)

  return (
    <main className="board-shell">
      <div className="board" ref={boardRef}>
        {clocks.length === 0 ? (
          <div className="board-empty">
            <p>La plancia e vuota.</p>
            <span>Aggiungi un clock quando il mondo inizia a muoversi.</span>
          </div>
        ) : null}

        {clocks.map((clock) => (
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
