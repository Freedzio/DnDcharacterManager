import { defaultTo } from "lodash";
import { APPLY_CHARACTER, RESET_STORE } from "../common/constants/storeCommons";
import { ClassSpecific } from "../common/models/models";
import { ActionProps } from "./store";

export const SET_SPECIFICS = 'SET_SPECIFICS';

export function setSpecifics(payload: ClassSpecific) {
  return {
    type: SET_SPECIFICS,
    payload: payload
  }
}

const initialState: Partial<ClassSpecific> = {};

export default function classSpecificReducer(state = initialState, action: ActionProps) {
  let newState = { ...state }

  switch (action.type) {
    case APPLY_CHARACTER:
      return action.payload.classSpecific

    case RESET_STORE:
      return initialState

    case SET_SPECIFICS:
      return {
        ...newState,
        ...action.payload
      }

    default:
      return state
  }
}