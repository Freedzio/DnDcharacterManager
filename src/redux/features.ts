import { Feature } from "../common/models/models";
import { APPLY_SNAPSHOT } from "./snapshot";
import { ActionProps } from "./store";
import { RESET_STORE } from "../common/constants/resetStore";

export const ADD_FEATURES = 'ADD_FEATURES';

export function addFeatures(payload: Array<Feature>) {
  return {
    type: ADD_FEATURES,
    payload: payload
  }
}

const initialState: { [key: string]: Feature } = {};

export default function featuresReducer(state = initialState, action: ActionProps) {
  let newState = { ...state };

  switch (action.type) {
    case APPLY_SNAPSHOT:
      return action.payload.features

    case ADD_FEATURES:
      for (let i = 0; i < action.payload.length; i++) {
        newState = {
          ...newState,
          [action.payload[i].index]: action.payload[i]
        }
      }
      return { ...newState }

      case RESET_STORE:
        return initialState
    default:
      return state

  }
}