import type { CampaignState } from '../types/campaign'

export const defaultCampaign: CampaignState = {
  schemaVersion: 1,
  campaignName: 'Sogno Erotico',
  tracks: [
    {
      id: 'attitude',
      name: 'Atteggiamento',
      leftLabel: 'Sociale',
      centerLabel: '0',
      rightLabel: 'Fisico',
      min: -10,
      max: 10,
      value: 0,
    },
    {
      id: 'factions',
      name: 'Percezione delle fazioni',
      leftLabel: 'Rinati',
      centerLabel: '0',
      rightLabel: 'Cantori',
      min: -10,
      max: 10,
      value: 0,
    },
  ],
  clocks: [],
}
