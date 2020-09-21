import { ActionProps } from "./store";
import { APPLY_CHARACTER, RESET_STORE } from "../common/constants/storeCommons";
import mapArrayToObject from "../common/functions/mapArrayToObject";
import { APPLY_SNAPSHOT } from "./snapshot";
import { AdventuringGear, Armor, EqItem, FinalItem, Weapon } from "../common/models/models";

export const WEAPON = 'WEAPON';
export const ARMOR = 'ARMOR';
export const ADVENTURING = 'ADVENTURING';
export const TOOLS = 'TOOLS';

export const ADD_ITEMS = 'ADD_ITEMS';
export const DELETE_ITEMS = 'DELETE_ITEMS';
export const INCREASE_QUANTITY = 'INCREASE_QUANTITY'
export const DECREASE_QUANTITY = 'DECREASE_QUANTITY'

export function addItems(payload: Array<FinalItem>) {
  return {
    type: ADD_ITEMS,
    payload: payload
  }
}

export function increaseQuantity(payload: string) {
  return {
    type: INCREASE_QUANTITY,
    payload: payload
  }
}

export function decreaseQuantity(payload: string) {
  return {
    type: DECREASE_QUANTITY,
    payload: payload
  }
}

export function deleteItems(payload: Array<string>) {
  return {
    type: DELETE_ITEMS,
    payload: payload
  }
}

const initialState: { [index: string]: Armor & Weapon & AdventuringGear } = {};

export default function itemsReducer(state = initialState, action: ActionProps) {
  var newState = { ...state };

  switch (action.type) {
    case APPLY_CHARACTER:
      return action.payload.items

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

    case DECREASE_QUANTITY:
      var tempQuan = newState[action.payload].quantity
      return {
        ...newState,
        [action.payload]: {
          ...newState[action.payload],
          quantity: tempQuan - 1
        }
      }

    case INCREASE_QUANTITY:
      var tempQuan = newState[action.payload].quantity
      return {
        ...newState,
        [action.payload]: {
          ...newState[action.payload],
          quantity: tempQuan + 1
        }
      }
    case RESET_STORE:
      return initialState

    default:
      return state
  }
}