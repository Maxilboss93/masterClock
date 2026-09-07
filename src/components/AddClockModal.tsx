import { useState } from 'react'
import type { ClockColor, ClockType } from '../types/campaign'

interface AddClockModalProps {
  onClose: () => void
  onCreate: (draft: {
    type: ClockType
    name: string
    segments: number
    color: ClockColor
  }) => void
}

const segmentPresets = [4, 6, 8, 10, 12]

export function AddClockModal({ onClose, onCreate }: AddClockModalProps) {
  const [type, setType] = useState<ClockType>('pie')
  const [name, setName] = useState('Nuovo clock')
  const [segments, setSegments] = useState(6)
  const [color, setColor] = useState<ClockColor>('gold')

  return (
    <div className="modal-backdrop" role="presentation">
      <form
        className="add-clock-modal"
        onSubmit={(event) => {
          event.preventDefault()
          onCreate({
            type,
            name: name.trim() || 'Nuovo clock',
            segments,
            color,
          })
        }}
      >
        <header>
          <h2>Aggiungi clock</h2>
          <button type="button" className="icon-button small" onClick={onClose}>
            x
          </button>
        </header>

        <label>
          Stile
          <select value={type} onChange={(event) => setType(event.target.value as ClockType)}>
            <option value="pie">Torta</option>
            <option value="bar">Barra segmentata</option>
          </select>
        </label>

        <label>
          Nome
          <input value={name} onChange={(event) => setName(event.target.value)} />
        </label>

        <fieldset>
          <legend>Segmenti</legend>
          <div className="preset-row">
            {segmentPresets.map((preset) => (
              <button
                key={preset}
                type="button"
                className={preset === segments ? 'preset active' : 'preset'}
                onClick={() => setSegments(preset)}
              >
                {preset}
              </button>
            ))}
          </div>
          <input
            type="number"
            min={2}
            max={12}
            value={segments}
            onChange={(event) =>
              setSegments(Math.min(Math.max(Number(event.target.value), 2), 12))
            }
          />
        </fieldset>

        <label>
          Colore
          <select value={color} onChange={(event) => setColor(event.target.value as ClockColor)}>
            <option value="gold">Oro</option>
            <option value="ember">Brace</option>
            <option value="blood">Sangue</option>
            <option value="moss">Muschio</option>
          </select>
        </label>

        <footer>
          <button type="button" className="plank-button" onClick={onClose}>
            Annulla
          </button>
          <button type="submit" className="plank-button primary">
            Crea
          </button>
        </footer>
      </form>
    </div>
  )
}
