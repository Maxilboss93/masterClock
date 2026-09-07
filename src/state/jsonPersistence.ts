import type {
  CampaignState,
  Clock,
  ClockColor,
  ClockSize,
  ClockType,
  Track,
} from '../types/campaign'
import { normalizeSegmentCount } from './numbers'

const clockTypes: ClockType[] = ['pie', 'bar']
const clockColors: ClockColor[] = ['gold', 'ember', 'blood', 'moss']
const clockSizes: ClockSize[] = ['small', 'medium', 'large']

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

const isString = (value: unknown): value is string => typeof value === 'string'

function validateTrack(value: unknown): Track | null {
  if (!isObject(value)) {
    return null
  }

  const {
    id,
    name,
    leftLabel,
    centerLabel,
    rightLabel,
    min,
    max,
    value: current,
  } = value

  if (
    !isString(id) ||
    !isString(name) ||
    !isString(leftLabel) ||
    !isString(centerLabel) ||
    !isString(rightLabel) ||
    !isNumber(min) ||
    !isNumber(max) ||
    !isNumber(current)
  ) {
    return null
  }

  return { id, name, leftLabel, centerLabel, rightLabel, min, max, value: current }
}

function validateClock(value: unknown): Clock | null {
  if (!isObject(value)) {
    return null
  }

  const {
    id,
    type,
    name,
    segments,
    filled,
    color,
    settings,
    position,
    size,
    locked,
    pinnedToParty,
    updatedAt,
  } = value

  if (
    !isString(id) ||
    !clockTypes.includes(type as ClockType) ||
    !isString(name) ||
    !isNumber(segments) ||
    !isNumber(filled) ||
    !clockColors.includes(color as ClockColor) ||
    !isObject(settings) ||
    typeof settings.showValue !== 'boolean' ||
    typeof settings.showControls !== 'boolean' ||
    !isObject(position) ||
    !isNumber(position.x) ||
    !isNumber(position.y) ||
    !clockSizes.includes(size as ClockSize) ||
    typeof locked !== 'boolean' ||
    !isString(updatedAt)
  ) {
    return null
  }

  const normalizedSegments = normalizeSegmentCount(segments)

  return {
    id,
    type: type as ClockType,
    name,
    segments: normalizedSegments,
    filled: Math.min(Math.max(Math.round(filled), 0), normalizedSegments),
    color: color as ClockColor,
    settings: {
      showValue: settings.showValue,
      showControls: settings.showControls,
    },
    position: {
      x: Math.max(0, Math.round(position.x)),
      y: Math.max(0, Math.round(position.y)),
    },
    size: size as ClockSize,
    locked,
    pinnedToParty: typeof pinnedToParty === 'boolean' ? pinnedToParty : false,
    updatedAt,
  }
}

export function parseCampaignJson(text: string): CampaignState {
  const parsed: unknown = JSON.parse(text)

  if (!isObject(parsed) || parsed.schemaVersion !== 1) {
    throw new Error('File non valido o versione schema non supportata.')
  }

  const { campaignName, tracks, clocks } = parsed

  if (!isString(campaignName) || !Array.isArray(tracks) || !Array.isArray(clocks)) {
    throw new Error('Il file deve contenere campaignName, tracks e clocks.')
  }

  const parsedTracks = tracks.map(validateTrack)
  const parsedClocks = clocks.map(validateClock)

  if (parsedTracks.some((track) => track === null)) {
    throw new Error('Una o piu barre nel file non sono valide.')
  }

  if (parsedClocks.some((clock) => clock === null)) {
    throw new Error('Uno o piu clock nel file non sono validi.')
  }

  return {
    schemaVersion: 1,
    campaignName,
    tracks: parsedTracks as Track[],
    clocks: parsedClocks as Clock[],
  }
}

export function campaignToJson(campaign: CampaignState): string {
  return JSON.stringify(campaign, null, 2)
}

export function downloadCampaignJson(campaign: CampaignState) {
  const slug =
    campaign.campaignName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'campagna'
  const today = new Date().toISOString().slice(0, 10)
  const fileName = `clock-campagna-${slug}-${today}.json`
  const blob = new Blob([campaignToJson(campaign)], {
    type: 'application/json;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}
