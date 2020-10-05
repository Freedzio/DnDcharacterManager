import { APPLY_CHARACTER, RESET_STORE } from "../common/constants/storeCommons";
import { APPLY_SNAPSHOT } from "./snapshot";
import { ActionProps } from "./store";

export const INCREASE_MAX_HP = 'INCREASE_MAX_HP'

export function increaseMaxHP(payload: number) {
  return {
    type: INCREASE_MAX_HP,
    payload: payload
  }
}

const initialState = 0;

export default function maxHPReducer(state = initialState, action: ActionProps) {
  let temp: number

  switch (action.type) {
    case APPLY_SNAPSHOT:
      return action.payload.maxHP

    case APPLY_CHARACTER:
      return action.payload.maxHP

    case RESET_STORE:
      return initialState

    case INCREASE_MAX_HP:
      temp = state;
      return temp + action.payload

      default:
        return state
  }
}