export type ClockType = 'pie' | 'bar'

export type ClockColor = 'gold' | 'ember' | 'blood' | 'moss'

export type ClockSize = 'small' | 'medium' | 'large'

export interface Track {
  id: string
  name: string
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

export interface CampaignState {
  schemaVersion: 1
  campaignName: string
  tracks: Track[]
  clocks: Clock[]
}
