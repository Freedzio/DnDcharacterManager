import { APPLY_CHARACTER, RESET_STORE } from "../common/constants/storeCommons";
import { Spell } from "../common/models/models";
import { ActionProps } from "./store";

export const ADD_SPELL = 'ADD_SPELL';
export const DELETE_SPELL = 'DELETE_SPELL';

export function addSpell(payload: Spell) {
  return {
    type: ADD_SPELL,
    payload: payload
  }
}

export function deleteSpell(payload: string) {
  return {
    type: DELETE_SPELL,
    payload: payload
  }
}

const initialState: { [key: string]: Spell } = {};

export default function spellsReducer(state = initialState, action: ActionProps) {
  let newState = { ...state }

  switch (action.type) {
    case ADD_SPELL:
      return {
        ...newState,
        [action.payload.index]: { ...action.payload }
      }

    case DELETE_SPELL:
      delete newState[action.payload]

      return { ...newState }

    case APPLY_CHARACTER:
      return action.payload.spells

    case RESET_STORE:
      return initialState

    default:
      return state
  }

}