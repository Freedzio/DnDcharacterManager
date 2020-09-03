import { ActionProps } from "./store";

export const SET_HIT_DIE = 'SET_HIT_DIE';

export function setHitDie(payload: number) {
  return {
    type: SET_HIT_DIE,
    payload: payload
  }
}

const initialState = 0;

export default function hitDieReducer(state = initialState, action: ActionProps) {
  switch (action.type) {
    case SET_HIT_DIE:
      return action.payload

    default:
      return state
  }
}