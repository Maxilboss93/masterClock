import type {
  BoardTrack,
  CampaignState,
  Clock,
  ClockColor,
  ClockSize,
  ClockType,
  PlayerCard,
  PlayerClock,
  PlayerTrack,
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
    graphLabel,
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

  return {
    id,
    name,
    graphLabel: isString(graphLabel) ? graphLabel : name,
    leftLabel,
    centerLabel,
    rightLabel,
    min,
    max,
    value: current,
  }
}

function validateClock(value: unknown): Clock | null {
  if (!isObject(value)) {
    return null
  }

  const {
    id,
    type,
    name,
    graphLabel,
    segments,
    filled,
    color,
    settings,
    position,
    size,
    locked,
    pinnedToParty,
    createdAt,
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
    graphLabel: isString(graphLabel) ? graphLabel : name,
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
    createdAt: isString(createdAt) ? createdAt : undefined,
    updatedAt,
  }
}

function validateBoardTrack(
  value: unknown,
  defaults?: Pick<BoardTrack, 'position' | 'size' | 'locked' | 'pinnedToTop' | 'updatedAt'>,
): BoardTrack | null {
  if (!isObject(value)) {
    return null
  }

  const {
    position,
    size,
    locked,
    pinnedToTop,
    updatedAt,
  } = value
  const track = validateTrack(value)
  const parsedPosition = isObject(position) && isNumber(position.x) && isNumber(position.y)
    ? {
        x: Math.max(0, Math.round(position.x)),
        y: Math.max(0, Math.round(position.y)),
      }
    : defaults?.position
  const parsedSize = clockSizes.includes(size as ClockSize) ? size as ClockSize : defaults?.size
  const parsedLocked = typeof locked === 'boolean' ? locked : defaults?.locked
  const parsedPinnedToTop =
    typeof pinnedToTop === 'boolean' ? pinnedToTop : defaults?.pinnedToTop
  const parsedUpdatedAt = isString(updatedAt) ? updatedAt : defaults?.updatedAt

  if (
    !track ||
    !parsedPosition ||
    !parsedSize ||
    typeof parsedLocked !== 'boolean' ||
    typeof parsedPinnedToTop !== 'boolean' ||
    !parsedUpdatedAt
  ) {
    return null
  }

  return {
    ...track,
    value: Math.min(Math.max(Math.round(track.value), track.min), track.max),
    position: parsedPosition,
    size: parsedSize,
    locked: parsedLocked,
    pinnedToTop: parsedPinnedToTop,
    createdAt: isString(value.createdAt) ? value.createdAt : undefined,
    updatedAt: parsedUpdatedAt,
  }
}

function validatePlayerTrack(value: unknown): PlayerTrack | null {
  if (!isObject(value)) {
    return null
  }

  const { updatedAt } = value
  const track = validateTrack(value)

  if (!track || !isString(updatedAt)) {
    return null
  }

  return {
    ...track,
    value: Math.min(Math.max(Math.round(track.value), track.min), track.max),
    createdAt: isString(value.createdAt) ? value.createdAt : undefined,
    updatedAt,
  }
}

function validatePlayerClock(value: unknown): PlayerClock | null {
  if (!isObject(value)) {
    return null
  }

  const {
    id,
    type,
    name,
    graphLabel,
    segments,
    filled,
    color,
    settings,
    createdAt,
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
    !isString(updatedAt)
  ) {
    return null
  }

  const normalizedSegments = normalizeSegmentCount(segments)

  return {
    id,
    type: type as ClockType,
    name,
    graphLabel: isString(graphLabel) ? graphLabel : name,
    segments: normalizedSegments,
    filled: Math.min(Math.max(Math.round(filled), 0), normalizedSegments),
    color: color as ClockColor,
    settings: {
      showValue: settings.showValue,
      showControls: settings.showControls,
    },
    createdAt: isString(createdAt) ? createdAt : undefined,
    updatedAt,
  }
}

function validatePlayerCard(value: unknown): PlayerCard | null {
  if (!isObject(value)) {
    return null
  }

  const {
    id,
    playerName,
    position,
    size,
    locked,
    tracks,
    clocks,
    createdAt,
    updatedAt,
  } = value

  if (
    !isString(id) ||
    !isString(playerName) ||
    !isObject(position) ||
    !isNumber(position.x) ||
    !isNumber(position.y) ||
    !clockSizes.includes(size as ClockSize) ||
    typeof locked !== 'boolean' ||
    !Array.isArray(tracks) ||
    !isString(updatedAt)
  ) {
    return null
  }

  const parsedTracks = tracks.map(validatePlayerTrack)
  const parsedClocks = Array.isArray(clocks) ? clocks.map(validatePlayerClock) : []

  if (parsedTracks.some((track) => track === null)) {
    return null
  }

  if (parsedClocks.some((clock) => clock === null)) {
    return null
  }

  return {
    id,
    playerName,
    position: {
      x: Math.max(0, Math.round(position.x)),
      y: Math.max(0, Math.round(position.y)),
    },
    size: size as ClockSize,
    locked,
    tracks: parsedTracks as PlayerTrack[],
    clocks: parsedClocks as PlayerClock[],
    createdAt: isString(createdAt) ? createdAt : undefined,
    updatedAt,
  }
}

export function parseCampaignJson(text: string): CampaignState {
  const parsed: unknown = JSON.parse(text)

  if (!isObject(parsed) || parsed.schemaVersion !== 1) {
    throw new Error('File non valido o versione schema non supportata.')
  }

  const { campaignName, tracks, clocks, boardTracks, playerCards } = parsed

  if (!isString(campaignName) || !Array.isArray(tracks) || !Array.isArray(clocks)) {
    throw new Error('Il file deve contenere campaignName, tracks e clocks.')
  }

  const now = new Date().toISOString()
  const parsedTracks = tracks.map((track, index) =>
    validateBoardTrack(track, {
      position: {
        x: 36 + (index % 3) * 60,
        y: 36 + (index % 3) * 44,
      },
      size: 'medium',
      locked: false,
      pinnedToTop: true,
      updatedAt: now,
    }),
  )
  const parsedClocks = clocks.map(validateClock)
  const parsedBoardTracks = Array.isArray(boardTracks)
    ? boardTracks.map((track, index) =>
        validateBoardTrack(track, {
          position: {
            x: 48 + (index % 3) * 60,
            y: 48 + (index % 3) * 44,
          },
          size: 'medium',
          locked: false,
          pinnedToTop: false,
          updatedAt: now,
        }),
      )
    : []
  const parsedPlayerCards = Array.isArray(playerCards)
    ? playerCards.map(validatePlayerCard)
    : []

  if (parsedTracks.some((track) => track === null)) {
    throw new Error('Una o piu barre nel file non sono valide.')
  }

  if (parsedBoardTracks.some((track) => track === null)) {
    throw new Error('Una o piu barre da plancia nel file non sono valide.')
  }

  if (parsedPlayerCards.some((playerCard) => playerCard === null)) {
    throw new Error('Una o piu card giocatore nel file non sono valide.')
  }

  if (parsedClocks.some((clock) => clock === null)) {
    throw new Error('Uno o piu clock nel file non sono validi.')
  }

  return {
    schemaVersion: 1,
    campaignName,
    tracks: parsedTracks as BoardTrack[],
    boardTracks: parsedBoardTracks as BoardTrack[],
    playerCards: parsedPlayerCards as PlayerCard[],
    clocks: parsedClocks as Clock[],
  }
}

export function campaignToJson(campaign: CampaignState): string {
  return JSON.stringify(campaign, null, 2)
}

export function downloadCampaignJson(campaign: CampaignState, label = campaign.campaignName) {
  const slug =
    label
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
