import { APPLY_SNAPSHOT } from "./snapshot";
import { APPLY_CHARACTER, RESET_STORE } from "../common/constants/storeCommons";
import { ActionProps } from "./store";

export const RESET_CLASS = 'RESET_CLASS';
export const LEVEL_CLASS = 'LEVEL_CLASS';

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
    let newState: { [key: string]: number } = {...state};
    let className: string = action.payload;
    let temp = newState[className] ? newState[className] : 0

    switch (action.type) {
        case APPLY_CHARACTER:
            return action.payload.classes
            
        case APPLY_SNAPSHOT:
            return action.payload.classes        

        case LEVEL_CLASS:           
            return {
                ...newState,
                [className]: temp + 1
            }

        case RESET_STORE:
            return initialState;

        default:
            return state
    }
}