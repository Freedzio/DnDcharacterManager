import { APPLY_SNAPSHOT } from "./snapshot";
import { APPLY_CHARACTER, RESET_STORE } from "../common/constants/storeCommons";
import { ActionProps } from "./store";

export const SET_SUBRACE = 'SET_SUBRACE';
export const RESET_SUBRACE = 'RESET_SUBRACE';

export function setSubrace(subrace: string) {
    return {
        type: SET_SUBRACE,
        payload: subrace
    }
};

const initialState = '';

export default function subraceReducer(state = initialState, action: ActionProps) {
    switch (action.type) {
        case APPLY_CHARACTER:
            return action.payload.subrace

        case APPLY_SNAPSHOT:
            return action.payload.subrace

        case SET_SUBRACE:
            return action.payload;

        case RESET_STORE:
            return initialState;

        default:
            return state
    }
}