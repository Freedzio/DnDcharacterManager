import { ActionProps } from "./store";
import { APPLY_CHARACTER, RESET_STORE } from "../common/constants/storeCommons";
import { APPLY_SNAPSHOT } from "./snapshot";

export const SET_LANGUAGES = 'SET_LANGUAGES';
export const RESET_LANGUGAGES = 'RESET_LANGUAGES';

export function setLanguages(payload: Array<string>) {
    return {
        type: SET_LANGUAGES,
        payload: payload
    }
}

export function resetLanguages() {
    return {
        type: RESET_LANGUGAGES
    }
}

const initialState: string[] = [];

export default function languagesReducer(state = initialState, action: ActionProps) {
    switch (action.type) {
        case APPLY_CHARACTER:
            return action.payload.languages

        case APPLY_SNAPSHOT:
            return action.payload.languages;

        case SET_LANGUAGES:
            let newState = [...state];
            const newerState = newState.concat(action.payload)

            return [...newerState]

        case RESET_STORE:
            return initialState

        default:
            return state
    }
}