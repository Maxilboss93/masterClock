import { useState } from 'react'
import { X } from 'lucide-react'
import { normalizeSegmentCount, normalizeTrackCellCount } from '../state/numbers'
import type { ClockColor, ClockType } from '../types/campaign'

type AddItemKind = 'clock' | 'track'

interface AddClockModalProps {
  onClose: () => void
  onCreate: (
    draft:
      | {
          kind: 'clock'
          type: ClockType
          name: string
          graphLabel: string
          segments: number
          color: ClockColor
        }
      | {
          kind: 'track'
          name: string
          graphLabel: string
          cells: number
          leftLabel: string
          centerLabel: string
          rightLabel: string
        },
  ) => void
}

const segmentPresets = [4, 6, 8, 10, 12]

export function AddClockModal({ onClose, onCreate }: AddClockModalProps) {
  const [kind, setKind] = useState<AddItemKind>('clock')
  const [type, setType] = useState<ClockType>('pie')
  const [name, setName] = useState('')
  const [graphLabel, setGraphLabel] = useState('')
  const [segments, setSegments] = useState(6)
  const [trackCells, setTrackCells] = useState(21)
  const [color, setColor] = useState<ClockColor>('gold')
  const [leftLabel, setLeftLabel] = useState('')
  const [centerLabel, setCenterLabel] = useState('0')
  const [rightLabel, setRightLabel] = useState('')

  const isTrack = kind === 'track'
  const titlePlaceholder = isTrack ? 'es. Tensione del sogno' : 'es. Allarme della cittadella'
  const labelPlaceholder = isTrack ? 'es. Equilibrio onirico' : 'es. Rintocchi mancanti'

  return (
    <div className="modal-backdrop" role="presentation">
      <form
        className="add-clock-modal"
        onSubmit={(event) => {
          event.preventDefault()

          if (kind === 'track') {
            onCreate({
              kind: 'track',
              name: name.trim() || 'Nuova barra',
              graphLabel: graphLabel.trim() || 'Barra',
              cells: trackCells,
              leftLabel: leftLabel.trim() || 'Sinistra',
              centerLabel: centerLabel.trim() || '0',
              rightLabel: rightLabel.trim() || 'Destra',
            })
            return
          }

          onCreate({
            kind: 'clock',
            type,
            name: name.trim() || 'Nuovo clock',
            graphLabel: graphLabel.trim() || 'Grafico',
            segments,
            color,
          })
        }}
      >
        <header>
          <h2>Aggiungi</h2>
          <button
            type="button"
            className="icon-button small"
            onClick={onClose}
            aria-label="Chiudi"
            title="Chiudi"
          >
            <X aria-hidden="true" size={16} />
          </button>
        </header>

        <label>
          Tipo
          <select
            value={kind}
            onChange={(event) => {
              const nextKind = event.target.value as AddItemKind
              setKind(nextKind)
            }}
          >
            <option value="clock">Clock</option>
            <option value="track">Barra</option>
          </select>
        </label>

        <label>
          Titolo card
          <input
            value={name}
            placeholder={titlePlaceholder}
            onChange={(event) => setName(event.target.value)}
          />
        </label>

        <label>
          Label grafico
          <input
            value={graphLabel}
            placeholder={labelPlaceholder}
            onChange={(event) => setGraphLabel(event.target.value)}
          />
        </label>

        {kind === 'clock' ? (
          <>
            <label>
              Stile
              <select value={type} onChange={(event) => setType(event.target.value as ClockType)}>
                <option value="pie">Torta</option>
                <option value="bar">Barra segmentata</option>
              </select>
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
                value={segments}
                onChange={(event) =>
                  setSegments(normalizeSegmentCount(Number(event.target.value)))
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
          </>
        ) : (
          <>
            <label>
              Caselle
              <input
                type="number"
                min={2}
                value={trackCells}
                onChange={(event) =>
                  setTrackCells(normalizeTrackCellCount(Number(event.target.value)))
                }
              />
            </label>
            <div className="track-draft-grid">
              <label>
                Sinistra
                <input
                  value={leftLabel}
                  placeholder="es. Sociale"
                  onChange={(event) => setLeftLabel(event.target.value)}
                />
              </label>
              <label>
                Centro
                <input
                  value={centerLabel}
                  placeholder="es. 0"
                  onChange={(event) => setCenterLabel(event.target.value)}
                />
              </label>
              <label>
                Destra
                <input
                  value={rightLabel}
                  placeholder="es. Fisico"
                  onChange={(event) => setRightLabel(event.target.value)}
                />
              </label>
            </div>
          </>
        )}

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
