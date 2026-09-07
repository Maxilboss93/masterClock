import type { CampaignState } from '../types/campaign'
import type { SavedScene, SavedScenesState } from '../types/savedScene'
import { campaignToJson, parseCampaignJson } from './jsonPersistence'

export const SAVED_SCENES_KEY = 'gdr-world-clocks:saved-scenes:v1'

const emptySavedScenes: SavedScenesState = {
  schemaVersion: 1,
  activeSaveId: null,
  saves: [],
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isString = (value: unknown): value is string => typeof value === 'string'

function cloneCampaign(campaign: CampaignState): CampaignState {
  return parseCampaignJson(campaignToJson(campaign))
}

function validateSavedScene(value: unknown): SavedScene | null {
  if (!isObject(value)) {
    return null
  }

  const { id, name, createdAt, updatedAt, campaign } = value

  if (!isString(id) || !isString(name) || !isString(createdAt) || !isString(updatedAt)) {
    return null
  }

  try {
    return {
      id,
      name,
      createdAt,
      updatedAt,
      campaign: cloneCampaign(campaign as CampaignState),
    }
  } catch {
    return null
  }
}

export function loadSavedScenes(): SavedScenesState {
  const stored = window.localStorage.getItem(SAVED_SCENES_KEY)

  if (!stored) {
    return emptySavedScenes
  }

  try {
    const parsed: unknown = JSON.parse(stored)

    if (!isObject(parsed) || parsed.schemaVersion !== 1 || !Array.isArray(parsed.saves)) {
      return emptySavedScenes
    }

    const saves = parsed.saves
      .map(validateSavedScene)
      .filter((save): save is SavedScene => save !== null)

    const activeSaveId = isString(parsed.activeSaveId)
      ? parsed.activeSaveId
      : null

    return {
      schemaVersion: 1,
      activeSaveId: saves.some((save) => save.id === activeSaveId) ? activeSaveId : null,
      saves,
    }
  } catch {
    return emptySavedScenes
  }
}

export function saveSavedScenes(savedScenes: SavedScenesState) {
  window.localStorage.setItem(SAVED_SCENES_KEY, JSON.stringify(savedScenes))
}

export function makeSavedScene(
  campaign: CampaignState,
  name: string,
  previous?: SavedScene,
): SavedScene {
  const now = new Date().toISOString()

  return {
    id: previous?.id ?? `save-${Date.now()}`,
    name,
    createdAt: previous?.createdAt ?? now,
    updatedAt: now,
    campaign: cloneCampaign(campaign),
  }
}
