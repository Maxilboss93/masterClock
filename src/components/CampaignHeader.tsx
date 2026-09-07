import { FolderOpen, Plus, RotateCcw, Save } from 'lucide-react'
import { useRef } from 'react'

interface CampaignHeaderProps {
  campaignName: string
  onCampaignNameChange: (name: string) => void
  onAddClock: () => void
  onSave: () => void
  onLoadFile: (file: File) => void
  onReset: () => void
}

export function CampaignHeader({
  campaignName,
  onCampaignNameChange,
  onAddClock,
  onSave,
  onLoadFile,
  onReset,
}: CampaignHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  return (
    <header className="campaign-header">
      <label className="campaign-title">
        <span>Campagna</span>
        <input
          value={campaignName}
          onChange={(event) => onCampaignNameChange(event.target.value)}
          aria-label="Nome campagna"
        />
      </label>

      <nav className="campaign-actions" aria-label="Azioni campagna">
        <button type="button" className="plank-button primary" onClick={onAddClock}>
          <Plus aria-hidden="true" size={18} />
          Aggiungi
        </button>
        <button type="button" className="plank-button" onClick={onSave}>
          <Save aria-hidden="true" size={18} />
          Salva
        </button>
        <button
          type="button"
          className="plank-button"
          onClick={() => fileInputRef.current?.click()}
        >
          <FolderOpen aria-hidden="true" size={18} />
          Carica
        </button>
        <button type="button" className="icon-button" onClick={onReset} aria-label="Reset">
          <RotateCcw aria-hidden="true" size={18} />
        </button>
      </nav>

      <input
        ref={fileInputRef}
        className="visually-hidden"
        type="file"
        accept="application/json,.json"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) {
            onLoadFile(file)
          }
          event.currentTarget.value = ''
        }}
      />
    </header>
  )
}
