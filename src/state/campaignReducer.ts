import type { BoardTrack, CampaignState, Clock, Track } from '../types/campaign'
import { normalizeSegmentCount } from './numbers'

type CampaignAction =
  | { type: 'setCampaignName'; name: string }
  | { type: 'updateTrack'; id: string; patch: Partial<Track> }
  | { type: 'addBoardTrack'; track: BoardTrack }
  | { type: 'updateBoardTrack'; id: string; patch: Partial<BoardTrack> }
  | { type: 'moveBoardTrack'; id: string; x: number; y: number }
  | { type: 'deleteBoardTrack'; id: string }
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
          return {
            ...nextTrack,
            value: clamp(nextTrack.value, nextTrack.min, nextTrack.max),
          }
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
