import { ActionProps } from "./store";
import { APPLY_SNAPSHOT } from "./snapshot";

export const SET_SUBRACE = 'SET_SUBRACE'

export function setSubrace(payload: string) {
  return {
    type: SET_SUBRACE,
    payload: payload
  }
}

const initialState = '';

export default function subraceReducer(state = initialState, action: ActionProps) {
  switch (action.type) {
    case SET_SUBRACE:
      return action.payload

    case APPLY_SNAPSHOT:
      return action.payload.subrace

    default:
      return state
  }
}