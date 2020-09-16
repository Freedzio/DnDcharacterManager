import { APPLY_CHARACTER, RESET_STORE } from "../common/constants/storeCommons";
import { APPLY_SNAPSHOT } from "./snapshot";
import { ActionProps } from "./store";

export const SET_ID = 'SET_ID';

export function setID(payload: string) {
  return {
    type: SET_ID,
    payload: payload
  }
}

const initialState = '';

export default function idReducer(state = initialState, action: ActionProps) {
  switch (action.type) {
    case APPLY_CHARACTER:
      return action.payload.id

    case RESET_STORE:
      return initialState

    case APPLY_SNAPSHOT:
      return action.payload.id

    case SET_ID:
      return action.payload

    default:
      return state
  }
}