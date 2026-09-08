import type {
  BoardTrack,
  CampaignState,
  Clock,
  PlayerCard,
  PlayerTrack,
  Track,
} from '../types/campaign'
import { normalizeSegmentCount } from './numbers'

type CampaignAction =
  | { type: 'setCampaignName'; name: string }
  | { type: 'updateTrack'; id: string; patch: Partial<Track> }
  | { type: 'addBoardTrack'; track: BoardTrack }
  | { type: 'updateBoardTrack'; id: string; patch: Partial<BoardTrack> }
  | { type: 'moveBoardTrack'; id: string; x: number; y: number }
  | { type: 'deleteBoardTrack'; id: string }
  | { type: 'addPlayerCard'; playerCard: PlayerCard }
  | { type: 'updatePlayerCard'; id: string; patch: Partial<PlayerCard> }
  | { type: 'movePlayerCard'; id: string; x: number; y: number }
  | { type: 'deletePlayerCard'; id: string }
  | { type: 'addPlayerTrack'; playerId: string; track: PlayerTrack }
  | { type: 'updatePlayerTrack'; playerId: string; trackId: string; patch: Partial<PlayerTrack> }
  | { type: 'deletePlayerTrack'; playerId: string; trackId: string }
  | { type: 'addClock'; clock: Clock }
  | { type: 'updateClock'; id: string; patch: Partial<Clock> }
  | { type: 'setClockFilled'; id: string; filled: number }
  | { type: 'moveClock'; id: string; x: number; y: number }
  | { type: 'deleteClock'; id: string }
  | { type: 'loadCampaign'; campaign: CampaignState }
  | { type: 'resetCampaign'; campaign: CampaignState }

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

const touchClock = (clock: Clock): Clock => ({
  ...clock,
  updatedAt: new Date().toISOString(),
})

const touchBoardTrack = (track: BoardTrack): BoardTrack => ({
  ...track,
  updatedAt: new Date().toISOString(),
})

const touchPlayerCard = (playerCard: PlayerCard): PlayerCard => ({
  ...playerCard,
  updatedAt: new Date().toISOString(),
})

const touchPlayerTrack = (track: PlayerTrack): PlayerTrack => ({
  ...track,
  updatedAt: new Date().toISOString(),
})

function normalizeTrack<TTrack extends Track>(track: TTrack): TTrack {
  return {
    ...track,
    value: clamp(track.value, track.min, track.max),
  }
}

export function campaignReducer(
  state: CampaignState,
  action: CampaignAction,
): CampaignState {
  switch (action.type) {
    case 'setCampaignName':
      return { ...state, campaignName: action.name }

    case 'updateTrack':
      return {
        ...state,
        tracks: state.tracks.map((track) => {
          if (track.id !== action.id) {
            return track
          }

          const nextTrack = { ...track, ...action.patch }
          return normalizeTrack(nextTrack)
        }),
      }

    case 'addBoardTrack':
      return { ...state, boardTracks: [...state.boardTracks, action.track] }

    case 'updateBoardTrack':
      return {
        ...state,
        boardTracks: state.boardTracks.map((track) => {
          if (track.id !== action.id) {
            return track
          }

          const nextTrack = { ...track, ...action.patch }
          return touchBoardTrack({
            ...nextTrack,
            value: clamp(nextTrack.value, nextTrack.min, nextTrack.max),
            locked: Boolean(nextTrack.locked),
          })
        }),
      }

    case 'moveBoardTrack':
      return {
        ...state,
        boardTracks: state.boardTracks.map((track) =>
          track.id === action.id
            ? touchBoardTrack({
                ...track,
                position: {
                  x: Math.max(0, Math.round(action.x)),
                  y: Math.max(0, Math.round(action.y)),
                },
              })
            : track,
        ),
      }

    case 'deleteBoardTrack':
      return {
        ...state,
        boardTracks: state.boardTracks.filter((track) => track.id !== action.id),
      }

    case 'addPlayerCard':
      return {
        ...state,
        playerCards: [...state.playerCards, action.playerCard],
      }

    case 'updatePlayerCard':
      return {
        ...state,
        playerCards: state.playerCards.map((playerCard) =>
          playerCard.id === action.id
            ? touchPlayerCard({
                ...playerCard,
                ...action.patch,
                locked: Boolean(action.patch.locked ?? playerCard.locked),
              })
            : playerCard,
        ),
      }

    case 'movePlayerCard':
      return {
        ...state,
        playerCards: state.playerCards.map((playerCard) =>
          playerCard.id === action.id
            ? touchPlayerCard({
                ...playerCard,
                position: {
                  x: Math.max(0, Math.round(action.x)),
                  y: Math.max(0, Math.round(action.y)),
                },
              })
            : playerCard,
        ),
      }

    case 'deletePlayerCard':
      return {
        ...state,
        playerCards: state.playerCards.filter((playerCard) => playerCard.id !== action.id),
      }

    case 'addPlayerTrack':
      return {
        ...state,
        playerCards: state.playerCards.map((playerCard) =>
          playerCard.id === action.playerId
            ? touchPlayerCard({
                ...playerCard,
                tracks: [...playerCard.tracks, action.track],
              })
            : playerCard,
        ),
      }

    case 'updatePlayerTrack':
      return {
        ...state,
        playerCards: state.playerCards.map((playerCard) =>
          playerCard.id === action.playerId
            ? touchPlayerCard({
                ...playerCard,
                tracks: playerCard.tracks.map((track) => {
                  if (track.id !== action.trackId) {
                    return track
                  }

                  return touchPlayerTrack(normalizeTrack({ ...track, ...action.patch }))
                }),
              })
            : playerCard,
        ),
      }

    case 'deletePlayerTrack':
      return {
        ...state,
        playerCards: state.playerCards.map((playerCard) =>
          playerCard.id === action.playerId
            ? touchPlayerCard({
                ...playerCard,
                tracks: playerCard.tracks.filter((track) => track.id !== action.trackId),
              })
            : playerCard,
        ),
      }

    case 'addClock':
      return { ...state, clocks: [...state.clocks, action.clock] }

    case 'updateClock':
      return {
        ...state,
        clocks: state.clocks.map((clock) => {
          if (clock.id !== action.id) {
            return clock
          }

          const nextClock = { ...clock, ...action.patch }
          const segments = normalizeSegmentCount(nextClock.segments)

          return touchClock({
            ...nextClock,
            segments,
            filled: clamp(nextClock.filled, 0, segments),
            pinnedToParty: Boolean(nextClock.pinnedToParty),
          })
        }),
      }

    case 'setClockFilled':
      return {
        ...state,
        clocks: state.clocks.map((clock) =>
          clock.id === action.id
            ? touchClock({
                ...clock,
                filled: clamp(action.filled, 0, clock.segments),
              })
            : clock,
        ),
      }

    case 'moveClock':
      return {
        ...state,
        clocks: state.clocks.map((clock) =>
          clock.id === action.id
            ? touchClock({
                ...clock,
                position: {
                  x: Math.max(0, Math.round(action.x)),
                  y: Math.max(0, Math.round(action.y)),
                },
              })
            : clock,
        ),
      }

    case 'deleteClock':
      return {
        ...state,
        clocks: state.clocks.filter((clock) => clock.id !== action.id),
      }

    case 'loadCampaign':
      return action.campaign

    case 'resetCampaign':
      return action.campaign

    default:
      return state
  }
}
