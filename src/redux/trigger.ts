import { ActionProps } from "./store";

export const TRIGGER = 'TRIGGER'

export function triggerStore() {
  return {
    type: TRIGGER
  }
}

const initialState = false;

export default function triggerReducer(state = initialState, action: ActionProps) {
  switch (action.type) {
    case TRIGGER:
      return !state

    default:
      return state
  }
}