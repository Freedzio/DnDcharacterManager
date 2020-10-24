import { APPLY_SNAPSHOT } from "./snapshot";
import { APPLY_CHARACTER, RESET_STORE } from "../common/constants/storeCommons";
import { ActionProps } from "./store";

export const ADD_SUBCLASS = 'ADD_SUBCLASS';

export function addSubclass(payload: { class: string, subclass: string }) {
  return {
    type: ADD_SUBCLASS,
    payload: payload
  }
}

const initialState: { [key: string]: string } = {};

export default function subclassReducer(state = initialState, action: ActionProps) {
  let newState = { ...state };

  switch (action.type) {
    case APPLY_CHARACTER:
      return action.payload.subclasses

    case APPLY_SNAPSHOT:
      return action.payload.subclasses

    case ADD_SUBCLASS:
      return {
        ...newState,
        [action.payload.class]: action.payload.subclass
      }

    default:
      return state
  }
}