import type { CampaignState } from '../types/campaign'

export const defaultCampaign: CampaignState = {
  schemaVersion: 1,
  campaignName: 'La caduta dei cieli',
  tracks: [
    {
      id: 'attitude',
      name: 'Atteggiamento',
      graphLabel: 'Bilanciamento del gruppo',
      leftLabel: 'Sociale',
      centerLabel: '0',
      rightLabel: 'Fisico',
      min: -10,
      max: 10,
      value: 0,
      position: {
        x: 36,
        y: 36,
      },
      size: 'medium',
      locked: false,
      pinnedToTop: true,
      updatedAt: '2026-09-07T00:00:00.000Z',
    },
    {
      id: 'factions',
      name: 'Percezione delle fazioni',
      graphLabel: 'Vicinanza percepita',
      leftLabel: 'Rinati',
      centerLabel: '0',
      rightLabel: 'Cantori',
      min: -10,
      max: 10,
      value: 0,
      position: {
        x: 96,
        y: 86,
      },
      size: 'medium',
      locked: false,
      pinnedToTop: true,
      updatedAt: '2026-09-07T00:00:00.000Z',
    },
  ],
  boardTracks: [],
  playerCards: [],
  clocks: [],
}
