import { ActionProps } from "./store";
import { RESET_STORE } from "../common/constants/resetStore";

export const ADD_EXPERTISE = 'ADD_EXPERTISE'
export const DELETE_EXPERTISE = 'DELETE_EXPERTISE'

export function addSkills(payload: Array<string>) {
  return {
    type: ADD_EXPERTISE,
    payload: payload
  }
}
export function deleteSkills(payload: Array<string>) {
  return {
    type: DELETE_EXPERTISE,
    payload: payload
  }
}

const initialState: Array<string> = [];

export default function expertiseReducer(state = initialState, action: ActionProps) {
  switch (action.type) {
    case ADD_EXPERTISE:
      return state.concat(action.payload)

    case DELETE_EXPERTISE:
      return state.filter(item => !action.payload.includes(item))

      case RESET_STORE:
        return initialState;

    default:
      return state
  }
}