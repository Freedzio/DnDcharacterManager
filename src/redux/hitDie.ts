import { ActionProps } from "./store";
import { APPLY_CHARACTER, RESET_STORE } from "../common/constants/storeCommons";
import { ADD_CLASS, LEVEL_CLASS } from "./class";

export const ADD_HIT_DIE = 'ADD_HIT_DIE';

export function addHitDie(payload: number) {
  return {
    type: ADD_HIT_DIE,
    payload: payload
  }
}

const initialState: { [key: number]: number } = {
  6: 0,
  8: 0,
  10: 0,
  12: 0
};

export default function hitDieReducer(state = initialState, action: ActionProps) {
  let newState: { [key: number]: number } = { ...state }

  switch (action.type) {
    case APPLY_CHARACTER:
      return action.payload.hitDies

    case ADD_HIT_DIE:

      return {
        ...newState,
        [action.payload]: newState[action.payload] + 1
      }

    case RESET_STORE:
      return initialState

    default:
      return state
  }
}