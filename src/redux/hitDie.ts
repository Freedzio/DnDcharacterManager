import { ActionProps } from "./store";
import { RESET_STORE } from "../common/constants/resetStore";
import { ADD_CLASS, LEVEL_CLASS } from "./class";

export const SET_HIT_DIE = 'SET_HIT_DIE';

export function setHitDie(payload: number) {
  return {
    type: SET_HIT_DIE,
    payload: payload
  }
}

const initialState: { [key: string]: number } = {};

export default function hitDieReducer(state = initialState, action: ActionProps) {
  let newState: { [key: string]: number };
  let className: string;
  let temp: number;


  switch (action.type) {
    case ADD_CLASS:
      return {
        ...state,
        [action.payload]: 1
      }

    case LEVEL_CLASS:
      newState = { ...state };
      className = action.payload;
      temp = state[className]
      return {
        ...newState,
        [className]: temp++
      }

    case RESET_STORE:
      return initialState

    default:
      return state
  }
}