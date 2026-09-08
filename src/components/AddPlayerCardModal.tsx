import { useState } from 'react'

interface AddPlayerCardModalProps {
  onClose: () => void
  onCreate: (playerName: string) => void
}

export function AddPlayerCardModal({ onClose, onCreate }: AddPlayerCardModalProps) {
  const [playerName, setPlayerName] = useState('Shisui')

  return (
    <div className="modal-backdrop" role="presentation">
      <form
        className="add-clock-modal"
        onSubmit={(event) => {
          event.preventDefault()
          onCreate(playerName.trim() || 'Nuovo giocatore')
        }}
      >
        <header>
          <h2>Aggiungi giocatore</h2>
          <button type="button" className="icon-button small" onClick={onClose}>
            x
          </button>
        </header>

        <label>
          Nome
          <input value={playerName} onChange={(event) => setPlayerName(event.target.value)} />
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
