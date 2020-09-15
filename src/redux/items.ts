import { ActionProps } from "./store";
import { RESET_STORE } from "../common/constants/resetStore";
import mapArrayToObject from "../common/functions/mapArrayToObject";
import { APPLY_SNAPSHOT } from "./snapshot";
import { EqItem } from "../common/models/models";

export const WEAPON = 'WEAPON';
export const ARMOR = 'ARMOR';
export const ADVENTURING = 'ADVENTURING';
export const TOOLS = 'TOOLS';

export const ADD_ITEMS = 'ADD_ITEMS'
export const DELETE_ITEMS = 'DELETE_ITEMS'

export function addItems(payload: Array<EqItem>) {
  return {
    type: ADD_ITEMS,
    payload: payload
  }
}

export function deleteItems(payload: Array<string>) {
  return {
    type: DELETE_ITEMS,
    payload: payload
  }
}

const initialState: { [index: string]: any } = {};

export default function itemsReducer(state = initialState, action: ActionProps) {
  var newState = { ...state };

  switch (action.type) {
    case APPLY_SNAPSHOT:
      return action.payload.items

    case ADD_ITEMS:

      const incomingData = mapArrayToObject(action.payload);

      newState = {
        ...newState,
        ...incomingData
      };

      return { ...newState }

    case DELETE_ITEMS:
      for (let i = 0; i < action.payload.length; i++) {
        delete newState[action.payload[i]]
      }

      return { ...newState }

      case RESET_STORE:
        return initialState

    default:
      return state
  }
}