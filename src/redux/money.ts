import { APPLY_CHARACTER } from "../common/constants/storeCommons"
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
        const totalCopper = newState['cp'] + newState['sp'] * 10 + newState['ep'] * 50 + newState['gp'] * 100 + newState['pp'] * 1000;
        let cost = 0;
        if (action.payload.unit === 'cp') cost = action.payload.quantity;
        if (action.payload.unit === 'sp') cost = action.payload.quantity * 10;
        if (action.payload.unit === 'ep') cost = action.payload.quantity * 50;
        if (action.payload.unit === 'gp') cost = action.payload.quantity * 100;
        if (action.payload.unit === 'pp') cost = action.payload.quantity * 1000;

        const newSum = totalCopper + cost;
        const newPP = Math.trunc(newSum / 1000);
        const newGP = Math.trunc((newSum % 1000) / 100);
        const newEP = Math.trunc(((newSum % 1000) % 100) / 50);
        const newSP = Math.trunc((((newSum % 1000) % 100) % 50) / 10);
        const newCP = Math.trunc(((((newSum) % 1000) % 100) % 50) % 10);

        return {
          'cp': newCP,
          'sp': newSP,
          'ep': newEP,
          'gp': newGP,
          'pp': newPP,
        }

      }

      return {
        ...newState,
        [action.payload.unit]: newState[action.payload.unit] + action.payload.quantity
      }

    case SPEND_MONEY:
      const totalCopper = newState['cp'] + newState['sp'] * 10 + newState['ep'] * 50 + newState['gp'] * 100 + newState['pp'] * 1000;
      let cost = 0;
      if (action.payload.unit === 'cp') cost = action.payload.quantity;
      if (action.payload.unit === 'sp') cost = action.payload.quantity * 10;
      if (action.payload.unit === 'ep') cost = action.payload.quantity * 50;
      if (action.payload.unit === 'gp') cost = action.payload.quantity * 100;
      if (action.payload.unit === 'pp') cost = action.payload.quantity * 1000;

      const newSum = totalCopper - cost;
      const newPP = Math.trunc(newSum / 1000);
      const newGP = Math.trunc((newSum % 1000) / 100);
      const newEP = Math.trunc(((newSum % 1000) % 100) / 50);
      const newSP = Math.trunc((((newSum % 1000) % 100) % 50) / 10);
      const newCP = Math.trunc(((((newSum) % 1000) % 100) % 50) % 10);

      return {
        'cp': newCP,
        'sp': newSP,
        'ep': newEP,
        'gp': newGP,
        'pp': newPP,
      }

    case APPLY_CHARACTER:
      return action.payload.money

    case SET_MONEY:
      return action.payload

    default:
      return state
  }
}

