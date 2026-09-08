import { Clock3 } from 'lucide-react'
import type { SavedScene } from '../types/savedScene'

interface SavedScenesSidebarProps {
  saves: SavedScene[]
  activeSaveId: string | null
  onLoadScene: (save: SavedScene) => void
}

const formatDate = (isoDate: string) =>
  new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoDate))

export function SavedScenesSidebar({
  saves,
  activeSaveId,
  onLoadScene,
}: SavedScenesSidebarProps) {
  const orderedSaves = [...saves].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

  return (
    <aside className="saved-scenes-sidebar" aria-label="Schermate salvate">
      <div className="saved-scenes-header">
        <Clock3 aria-hidden="true" size={18} />
        <h2>Salvataggi</h2>
      </div>

      {orderedSaves.length === 0 ? (
        <p className="saved-scenes-empty">Nessuna schermata salvata.</p>
      ) : (
        <div className="saved-scenes-list">
          {orderedSaves.map((save) => {
            const clockCount = save.campaign.clocks.length
            const trackCount = save.campaign.boardTracks.length
            const playerCount = save.campaign.playerCards.length
            const isActive = save.id === activeSaveId

            return (
              <button
                key={save.id}
                type="button"
                className={`saved-scene-button${isActive ? ' active' : ''}`}
                onClick={() => onLoadScene(save)}
              >
                <span className="saved-scene-name">{save.name}</span>
                <span className="saved-scene-meta">
                  {formatDate(save.updatedAt)} · {clockCount} clock · {trackCount} barre ·{' '}
                  {playerCount} giocatori
                </span>
              </button>
            )
          })}
        </div>
      )}
    </aside>
  )
}
