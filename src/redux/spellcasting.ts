import { APPLY_CHARACTER, RESET_STORE } from "../common/constants/storeCommons";
import { Spellcasting } from "../common/models/models";
import { ActionProps } from "./store";

export const SET_SPELLCASTING = 'SET_SPELLCASTING'

export function setSpellcasting(payload: { [classId: string]: Spellcasting }) {
  return {
    type: SET_SPELLCASTING,
    payload: payload
  }
}

const initialState: { [classId: string]: Spellcasting } = {};

export default function spellcastingReducer(state = initialState, action: ActionProps) {
  let newState = { ...state }

  switch (action.type) {
    case APPLY_CHARACTER:
      return action.payload.spellcasting;

    case RESET_STORE:
      return initialState

    case SET_SPELLCASTING:
      return {
        ...newState,
        ...action.payload
      }

    default:
      return state
  }
}