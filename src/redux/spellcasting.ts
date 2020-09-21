import { APPLY_CHARACTER, RESET_STORE } from "../common/constants/storeCommons";
import { SpellcastingByLevel } from "../common/models/models";
import { APPLY_SNAPSHOT } from "./snapshot";
import { ActionProps } from "./store";

export const SET_SPELLCASTING = 'SET_SPELLCASTING'

export function setSpellcastingData(payload: { classId: string, spellcasting: Partial<SpellcastingByLevel> }) {
  return {
    type: SET_SPELLCASTING,
    payload: payload
  }
}

const initialState: { [classId: string]: SpellcastingByLevel } = {};

export default function spellcastingReducer(state = initialState, action: ActionProps) {
  let newState = { ...state }

  switch (action.type) {
    case APPLY_CHARACTER:
      return action.payload.spellcasting;

    case APPLY_SNAPSHOT:
      return action.payload.spellcasting;


    case RESET_STORE:
      return initialState

    case SET_SPELLCASTING:
      return {
        ...newState,
        [action.payload.classId]: {
          ...newState[action.payload.classId],
          ...action.payload.spellcasting
        }
      }

    default:
      return state
  }
}