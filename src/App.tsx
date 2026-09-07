import { useEffect, useReducer, useState } from 'react'
import { AddClockModal } from './components/AddClockModal'
import { Board } from './components/Board'
import { CampaignHeader } from './components/CampaignHeader'
import { FixedTracks } from './components/FixedTracks'
import { campaignReducer } from './state/campaignReducer'
import { defaultCampaign } from './state/defaultCampaign'
import { downloadCampaignJson, parseCampaignJson } from './state/jsonPersistence'
import { loadStoredCampaign, saveStoredCampaign } from './state/storage'
import type { Clock } from './types/campaign'
import './styles/theme.css'
import './styles/app.css'

function App() {
  const [campaign, dispatch] = useReducer(campaignReducer, undefined, loadStoredCampaign)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    saveStoredCampaign(campaign)
  }, [campaign])

  const createClock = (draft: Pick<Clock, 'type' | 'name' | 'segments' | 'color'>) => {
    const nextIndex = campaign.clocks.length + 1
    const clock: Clock = {
      id: `clock-${Date.now()}`,
      type: draft.type,
      name: draft.name,
      segments: draft.segments,
      filled: 0,
      color: draft.color,
      settings: {
        showValue: true,
        showControls: true,
      },
      position: {
        x: 40 + ((nextIndex - 1) % 4) * 40,
        y: 40 + ((nextIndex - 1) % 4) * 34,
      },
      size: 'medium',
      locked: false,
      pinnedToParty: false,
      updatedAt: new Date().toISOString(),
    }

    dispatch({ type: 'addClock', clock })
    setIsAddModalOpen(false)
  }

  const loadFile = async (file: File) => {
    setLoadError('')

    try {
      const text = await file.text()
      const loadedCampaign = parseCampaignJson(text)
      const shouldReplace =
        campaign.clocks.length === 0 ||
        window.confirm('Sostituire la plancia corrente con il file selezionato?')

      if (shouldReplace) {
        dispatch({ type: 'loadCampaign', campaign: loadedCampaign })
      }
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'File JSON non valido.')
    }
  }

  return (
    <div className="app-shell">
      <CampaignHeader
        campaignName={campaign.campaignName}
        onCampaignNameChange={(name) => dispatch({ type: 'setCampaignName', name })}
        onAddClock={() => setIsAddModalOpen(true)}
        onSave={() => downloadCampaignJson(campaign)}
        onLoadFile={loadFile}
        onReset={() => {
          if (window.confirm('Ripartire da una plancia vuota?')) {
            dispatch({ type: 'resetCampaign', campaign: defaultCampaign })
          }
        }}
      />

      <FixedTracks
        tracks={campaign.tracks}
        onTrackChange={(id, patch) => dispatch({ type: 'updateTrack', id, patch })}
      />

      {loadError ? <p className="load-error">{loadError}</p> : null}

      <Board
        clocks={campaign.clocks}
        onUpdateClock={(id, patch) => dispatch({ type: 'updateClock', id, patch })}
        onSetClockFilled={(id, filled) => dispatch({ type: 'setClockFilled', id, filled })}
        onMoveClock={(id, x, y) => dispatch({ type: 'moveClock', id, x, y })}
        onDeleteClock={(id) => dispatch({ type: 'deleteClock', id })}
      />

      {isAddModalOpen ? (
        <AddClockModal onClose={() => setIsAddModalOpen(false)} onCreate={createClock} />
      ) : null}
    </div>
  )
}

export default App
