import { ActionProps } from "./store";
import { APPLY_CHARACTER, RESET_STORE } from "../common/constants/storeCommons";
import { mapArrayToObject } from "../common/functions/mapArrayToObject";
import { APPLY_SNAPSHOT } from "./snapshot";
import { AdventuringGear, Armor, EqItem, FinalItem, Weapon } from "../common/models/models";

export const WEAPON = 'WEAPON';
export const ARMOR = 'ARMOR';
export const ADVENTURING = 'ADVENTURING';
export const TOOLS = 'TOOLS';

export const ADD_ITEMS = 'ADD_ITEMS';
export const ADD_SINGLE_ITEM = 'ADD_SINGLE_ITEM';
export const DELETE_ITEM = 'DELETE_ITEM';
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

export function deleteItem(payload: string) {
  return {
    type: DELETE_ITEM,
    payload: payload
  }
}

export function addSingleItem(payload: { [key: string]: FinalItem }) {
  return {
    type: ADD_SINGLE_ITEM,
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

    case ADD_SINGLE_ITEM:
      return {
        ...newState,
        ...action.payload
      }

    case DELETE_ITEM:
      delete newState[action.payload]
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