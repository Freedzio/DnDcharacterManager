import { APPLY_CHARACTER } from "../common/constants/storeCommons"
import calculateMoney from "../common/functions/calculateMoney"
import { Money } from "../common/models/models"
import { ActionProps, applyCharacter } from "./store"

export const ADD_MONEY = 'ADD_MONEY'
export const SPEND_MONEY = 'SPEND_MONEY'
export const SET_MONEY = 'SET_MONEY'

export function addMoney(payload: { unit: string, quantity: number }) {
  return {
    type: ADD_MONEY,
    payload: payload
  }
}

export function spendMoney(payload: { unit: string, quantity: number }) {
  return {
    type: SPEND_MONEY,
    payload: payload
  }
}

export function setMoney(payload: Money) {
  return {
    type: SET_MONEY,
    payload: payload
  }
}

const initialState: { [unit: string]: number } = {
  'cp': 0,
  'sp': 0,
  'ep': 0,
  'gp': 0,
  'pp': 0,
}

export default function moneyReducer(state = initialState, action: ActionProps) {
  let newState = { ...state };

  switch (action.type) {
    case ADD_MONEY:
      if (Object.values(newState).some(amount => amount < 0)) {
        return calculateMoney(newState, action.payload, 'sell')
      }

      return {
        ...newState,
        [action.payload.unit]: newState[action.payload.unit] + action.payload.quantity
      }

    case SPEND_MONEY:
      return calculateMoney(newState, action.payload, 'buy')

    case APPLY_CHARACTER:
      return action.payload.money

    case SET_MONEY:
      return action.payload

    default:
      return state
  }
}

