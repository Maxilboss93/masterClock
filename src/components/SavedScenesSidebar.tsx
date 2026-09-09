import { Clock3, PanelLeftClose, PanelLeftOpen, Trash2 } from 'lucide-react'
import type { SavedScene } from '../types/savedScene'

interface SavedScenesSidebarProps {
  saves: SavedScene[]
  activeSaveId: string | null
  isOpen: boolean
  onToggle: () => void
  onLoadScene: (save: SavedScene) => void
  onDeleteScene: (save: SavedScene) => void
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
  isOpen,
  onToggle,
  onLoadScene,
  onDeleteScene,
}: SavedScenesSidebarProps) {
  const orderedSaves = [...saves].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

  return (
    <aside
      className={`saved-scenes-sidebar ${isOpen ? '' : 'collapsed'}`}
      aria-label="Schermate salvate"
    >
      <div className="saved-scenes-header">
        <div className="saved-scenes-title">
          <Clock3 aria-hidden="true" size={18} />
          {isOpen ? <h2>Salvataggi</h2> : null}
        </div>
        <button
          type="button"
          className="icon-button small"
          onClick={onToggle}
          aria-label={isOpen ? 'Nascondi salvataggi' : 'Mostra salvataggi'}
          title={isOpen ? 'Nascondi salvataggi' : 'Mostra salvataggi'}
        >
          {isOpen ? (
            <PanelLeftClose aria-hidden="true" size={15} />
          ) : (
            <PanelLeftOpen aria-hidden="true" size={15} />
          )}
        </button>
      </div>

      {isOpen ? (
        orderedSaves.length === 0 ? (
          <p className="saved-scenes-empty">Nessuna schermata salvata.</p>
        ) : (
          <div className="saved-scenes-list">
            {orderedSaves.map((save) => {
              const clockCount = save.campaign.clocks.length
              const trackCount = save.campaign.boardTracks.length
              const playerCount = save.campaign.playerCards.length
              const isActive = save.id === activeSaveId

              return (
                <div key={save.id} className={`saved-scene${isActive ? ' active' : ''}`}>
                  <button
                    type="button"
                    className="saved-scene-button"
                    onClick={() => onLoadScene(save)}
                  >
                    <span className="saved-scene-name">{save.name}</span>
                    <span className="saved-scene-meta">
                      {formatDate(save.updatedAt)} · {clockCount} clock · {trackCount} barre ·{' '}
                      {playerCount} giocatori
                    </span>
                  </button>
                  <button
                    type="button"
                    className="saved-scene-delete"
                    onClick={() => onDeleteScene(save)}
                    aria-label={`Elimina il salvataggio ${save.name}`}
                    title="Elimina salvataggio"
                  >
                    <Trash2 aria-hidden="true" size={15} />
                  </button>
                </div>
              )
            })}
          </div>
        )
      ) : null}
    </aside>
  )
}
