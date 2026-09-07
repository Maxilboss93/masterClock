import type { CampaignState, Clock, Track } from '../types/campaign'

type CampaignAction =
  | { type: 'setCampaignName'; name: string }
  | { type: 'updateTrack'; id: string; patch: Partial<Track> }
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
          const segments = clamp(Math.round(nextClock.segments), 2, 12)

          return touchClock({
            ...nextClock,
            segments,
            filled: clamp(nextClock.filled, 0, segments),
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
