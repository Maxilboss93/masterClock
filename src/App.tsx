import { useEffect, useReducer, useState } from 'react'
import { AddClockModal } from './components/AddClockModal'
import { Board } from './components/Board'
import { CampaignHeader } from './components/CampaignHeader'
import { FixedTracks } from './components/FixedTracks'
import { SavedScenesSidebar } from './components/SavedScenesSidebar'
import { campaignReducer } from './state/campaignReducer'
import { defaultCampaign } from './state/defaultCampaign'
import { campaignToJson, downloadCampaignJson, parseCampaignJson } from './state/jsonPersistence'
import { loadSavedScenes, makeSavedScene, saveSavedScenes } from './state/savedScenes'
import { loadStoredCampaign, saveStoredCampaign } from './state/storage'
import type { Clock } from './types/campaign'
import type { SavedScene } from './types/savedScene'
import './styles/theme.css'
import './styles/app.css'

function App() {
  const [campaign, dispatch] = useReducer(campaignReducer, undefined, loadStoredCampaign)
  const [savedScenes, setSavedScenes] = useState(loadSavedScenes)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    saveStoredCampaign(campaign)
  }, [campaign])

  useEffect(() => {
    saveSavedScenes(savedScenes)
  }, [savedScenes])

  const activeSave = savedScenes.saves.find((save) => save.id === savedScenes.activeSaveId)
  const hasUnsavedChanges = activeSave
    ? campaignToJson(campaign) !== campaignToJson(activeSave.campaign)
    : campaignToJson(campaign) !== campaignToJson(defaultCampaign)

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

  const askForSaveName = (defaultName: string): string | null => {
    const requestedName = window.prompt('Salva con nome', defaultName)

    if (requestedName === null) {
      return null
    }

    const trimmedName = requestedName.trim()
    return trimmedName || 'Senza nome'
  }

  const saveNamedScene = () => {
    setLoadError('')
    setStatusMessage('')

    const initialName = activeSave?.name ?? campaign.campaignName
    let nextName = askForSaveName(initialName)

    if (!nextName) {
      return
    }

    const findSaveByName = (name: string) =>
      savedScenes.saves.find((save) => save.name.toLowerCase() === name.toLowerCase())

    let previousSave =
      activeSave && activeSave.name.toLowerCase() === nextName.toLowerCase()
        ? activeSave
        : findSaveByName(nextName)

    if (previousSave && previousSave.id !== activeSave?.id) {
      const overwrite = window.confirm(
        `Esiste gia un salvataggio chiamato "${previousSave.name}". Sovrascriverlo?`,
      )

      if (!overwrite) {
        const copyName = askForSaveName(`${nextName} copia`)

        if (!copyName) {
          return
        }

        nextName = copyName
        previousSave = undefined

        if (findSaveByName(nextName)) {
          window.alert('Esiste gia un salvataggio con questo nome. Scegli un altro nome.')
          return
        }
      }
    }

    const scene = makeSavedScene(campaign, nextName, previousSave)

    setSavedScenes((current) => ({
      schemaVersion: 1,
      activeSaveId: scene.id,
      saves: [scene, ...current.saves.filter((save) => save.id !== scene.id)],
    }))
    downloadCampaignJson(campaign, scene.name)
    setStatusMessage(`Salvataggio "${scene.name}" creato nella barra laterale e scaricato in JSON.`)
  }

  const loadSavedScene = (save: SavedScene) => {
    setLoadError('')
    setStatusMessage('')

    if (hasUnsavedChanges) {
      const shouldReplace = window.confirm(
        'La plancia corrente ha modifiche non salvate. Caricare questa schermata salvata?',
      )

      if (!shouldReplace) {
        return
      }
    }

    dispatch({ type: 'loadCampaign', campaign: save.campaign })
    setSavedScenes((current) => ({ ...current, activeSaveId: save.id }))
    setStatusMessage(`Schermata "${save.name}" caricata.`)
  }

  const loadFile = async (file: File) => {
    setLoadError('')
    setStatusMessage('')

    try {
      const text = await file.text()
      const loadedCampaign = parseCampaignJson(text)

      const shouldReplace =
        !hasUnsavedChanges ||
        window.confirm('Sostituire la plancia corrente con il file JSON selezionato?')

      if (shouldReplace) {
        dispatch({ type: 'loadCampaign', campaign: loadedCampaign })
        setSavedScenes((current) => ({ ...current, activeSaveId: null }))
        setStatusMessage('JSON caricato. Premi Salva per aggiungerlo alla barra laterale.')
      }
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'File JSON non valido.')
    }
  }

  return (
    <div className="app-shell">
      <SavedScenesSidebar
        saves={savedScenes.saves}
        activeSaveId={savedScenes.activeSaveId}
        onLoadScene={loadSavedScene}
      />

      <div className="app-workspace">
        <CampaignHeader
          campaignName={campaign.campaignName}
          onCampaignNameChange={(name) => dispatch({ type: 'setCampaignName', name })}
          onAddClock={() => setIsAddModalOpen(true)}
          onSave={saveNamedScene}
          onLoadFile={loadFile}
          onReset={() => {
            if (window.confirm('Ripartire da una plancia vuota?')) {
              dispatch({ type: 'resetCampaign', campaign: defaultCampaign })
              setSavedScenes((current) => ({ ...current, activeSaveId: null }))
              setStatusMessage('Plancia azzerata.')
            }
          }}
        />

        <FixedTracks
          tracks={campaign.tracks}
          onTrackChange={(id, patch) => dispatch({ type: 'updateTrack', id, patch })}
        />

        {loadError ? <p className="load-error">{loadError}</p> : null}
        {statusMessage ? <p className="status-message">{statusMessage}</p> : null}

        <Board
          clocks={campaign.clocks}
          onUpdateClock={(id, patch) => dispatch({ type: 'updateClock', id, patch })}
          onSetClockFilled={(id, filled) => dispatch({ type: 'setClockFilled', id, filled })}
          onMoveClock={(id, x, y) => dispatch({ type: 'moveClock', id, x, y })}
          onDeleteClock={(id) => dispatch({ type: 'deleteClock', id })}
        />
      </div>

      {isAddModalOpen ? (
        <AddClockModal onClose={() => setIsAddModalOpen(false)} onCreate={createClock} />
      ) : null}
    </div>
  )
}

export default App
