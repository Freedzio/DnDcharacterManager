import { APPLY_CHARACTER, RESET_STORE } from "../common/constants/storeCommons";
import { ActionProps } from "./store";

export const EQUIP_ITEM = 'EQUIP_ITEM'
export const UNEQUIP_ITEM = 'UNEQUIP_ITEM'

export function equipItem(payload: string) {
  return {
    type: EQUIP_ITEM,
    payload: payload
  }
}

export function unequipItem(payload: string) {
  return {
    type: UNEQUIP_ITEM,
    payload: payload
  }
}

const initialState: string[] = [];

export default function equippedReducer(state = initialState, action: ActionProps) {
  let newState = [...state]
  switch (action.type) {
    case EQUIP_ITEM:
      newState.push(action.payload)
      return newState;

    case UNEQUIP_ITEM:
      return newState.filter(item => item !== action.payload)

    case APPLY_CHARACTER:
      return action.payload.equipped

    case RESET_STORE:
      return initialState;

    default:
      return state
  }
}