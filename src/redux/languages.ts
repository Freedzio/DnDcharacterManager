import { ActionProps } from "./store";

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
        case SET_LANGUAGES:
            return action.payload

        case RESET_LANGUGAGES:
            return initialState

        default:
            return state
    }
}