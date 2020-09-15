import { ActionProps, StoreProps } from "./store";
import { RESET_STORE } from "../common/constants/resetStore";

export const TAKE_SNAPSHOT = 'TAKE_SNAPSHOT'
export const APPLY_SNAPSHOT = 'APPLY_SNAPSHOT'

export function takeSnapshot(payload: StoreProps) {
  return {
    type: TAKE_SNAPSHOT,
    payload: payload
  }
}

export function applySnapshot(payload: StoreProps) {
  return {
    type: APPLY_SNAPSHOT,
    payload: payload
  }
}

const initialState: StoreProps | null = null;

export default function snapshotReducer(state = initialState, action: ActionProps) {
  switch (action.type) {
    case TAKE_SNAPSHOT:
      return action.payload

    case APPLY_SNAPSHOT:
      const previousState = { ...action.payload.snapshot }
      return previousState

    case RESET_STORE:
      return initialState

    default:
      return state
  }
}