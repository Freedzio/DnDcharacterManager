import { ActionProps } from "./store";
import { APPLY_CHARACTER, RESET_STORE } from "../common/constants/storeCommons";

export const ADD_NAME = 'ADD_NAME';
export const RESET_NAME = 'RESET_NAME';

export function addName(name: string) {
    return {
        type: ADD_NAME,
        payload: name
    }
}

const initialState = '';

export default function nameReducer(state = initialState, action: ActionProps) {
    switch (action.type) {
        case APPLY_CHARACTER:
            return action.payload.name

        case ADD_NAME:
            return action.payload

        case RESET_STORE:
            return initialState

        default:
            return state
    }
}