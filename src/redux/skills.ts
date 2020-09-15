import { ActionProps } from "./store";
import { RESET_STORE } from "../common/constants/resetStore";

export const ADD_SKILLS = 'ADD_SKILLS'
export const DELETE_SKILLS = 'DELETE_SKILLS'

export function addSkills(payload: Array<string>) {
  return {
    type: ADD_SKILLS,
    payload: payload
  }
}
export function deleteSkills(payload: Array<string>) {
  return {
    type: DELETE_SKILLS,
    payload: payload
  }
}

const initialState: Array<string> = [];

export default function skillsReducer(state = initialState, action: ActionProps) {
  switch (action.type) {
    case ADD_SKILLS:
      return state.concat(action.payload)

    case DELETE_SKILLS:
      return state.filter(item => !action.payload.includes(item))

      case RESET_STORE:
        return initialState

    default:
      return state
  }
}