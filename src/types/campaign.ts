export type ClockType = 'pie' | 'bar'

export type ClockColor = 'gold' | 'ember' | 'blood' | 'moss'

export type ClockSize = 'small' | 'medium' | 'large'

export interface Track {
  id: string
  name: string
  graphLabel: string
  leftLabel: string
  centerLabel: string
  rightLabel: string
  min: number
  max: number
  value: number
}

export interface ClockSettings {
  showValue: boolean
  showControls: boolean
}

export interface ClockPosition {
  x: number
  y: number
}

export interface Clock {
  id: string
  type: ClockType
  name: string
  graphLabel: string
  segments: number
  filled: number
  color: ClockColor
  settings: ClockSettings
  position: ClockPosition
  size: ClockSize
  locked: boolean
  pinnedToParty: boolean
  updatedAt: string
}

export interface BoardTrack extends Track {
  position: ClockPosition
  size: ClockSize
  locked: boolean
  pinnedToTop: boolean
  updatedAt: string
}

export interface PlayerTrack extends Track {
  updatedAt: string
}

export interface PlayerCard {
  id: string
  playerName: string
  position: ClockPosition
  size: ClockSize
  locked: boolean
  tracks: PlayerTrack[]
  updatedAt: string
}

export interface CampaignState {
  schemaVersion: 1
  campaignName: string
  tracks: BoardTrack[]
  boardTracks: BoardTrack[]
  playerCards: PlayerCard[]
  clocks: Clock[]
}
