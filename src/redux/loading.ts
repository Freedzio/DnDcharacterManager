import { ActionProps } from "./store";

export const SET_LOADING = 'SET_LOADING';

export function setLoading(payload: boolean) {
  return {
    type: SET_LOADING,
    payload: payload
  }
}

const initialState = true;

export default function loadingReducer(state = initialState, action: ActionProps) {
  switch (action.type) {
    case SET_LOADING:
      return action.payload

    default: return state
  }
}