import type { CampaignState } from '../types/campaign'
import { defaultCampaign } from './defaultCampaign'
import { campaignToJson, parseCampaignJson } from './jsonPersistence'

export const STORAGE_KEY = 'gdr-world-clocks:v1'

export function loadStoredCampaign(): CampaignState {
  const stored = window.localStorage.getItem(STORAGE_KEY)

  if (!stored) {
    return defaultCampaign
  }

  try {
    return parseCampaignJson(stored)
  } catch {
    return defaultCampaign
  }
}

export function saveStoredCampaign(campaign: CampaignState) {
  window.localStorage.setItem(STORAGE_KEY, campaignToJson(campaign))
}
