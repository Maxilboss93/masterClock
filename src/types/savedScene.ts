import type { CampaignState } from './campaign'

export interface SavedScene {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  campaign: CampaignState
}

export interface SavedScenesState {
  schemaVersion: 1
  activeSaveId: string | null
  saves: SavedScene[]
}
