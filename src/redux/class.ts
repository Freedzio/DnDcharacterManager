import { APPLY_SNAPSHOT } from "./snapshot";
import { APPLY_CHARACTER, RESET_STORE } from "../common/constants/storeCommons";
import { ActionProps } from "./store";

export const ADD_CLASS = 'ADDD_CLASS';
export const RESET_CLASS = 'RESET_CLASS';
export const LEVEL_CLASS = 'LEVEL_CLASS';

export function addClass(characterClass: string) {
    return {
        type: ADD_CLASS,
        payload: characterClass
    }
};

export function resetClass() {
    return {
        action: RESET_CLASS
    }
};

export function levelClass(payload: string) {
    return {
        type: LEVEL_CLASS,
        payload: payload
    }
}

const initialState: { [key: string]: number } = {};

export default function classReducer(state = initialState, action: ActionProps) {
    let newState: { [key: string]: number };
    let className: string;
    let temp: number;

    switch (action.type) {
        case APPLY_CHARACTER:
            return action.payload.classes
            
        case APPLY_SNAPSHOT:
            return action.payload.classes

        case ADD_CLASS:
            return {
                ...state,
                [action.payload]: 1
            };

        case LEVEL_CLASS:
            newState = { ...state };
            className = action.payload;
            temp = state[className]
            return {
                ...newState,
                [className]: temp++
            }

        case RESET_STORE:
            return initialState;

        default:
            return state
    }
}