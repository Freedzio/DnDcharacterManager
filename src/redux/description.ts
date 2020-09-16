import { ActionProps } from "./store";
import { APPLY_SNAPSHOT } from "./snapshot";
import { RESET_STORE } from "../common/constants/storeCommons";

export const SET_DESCRIPTION = 'SET_DESCRIPTION'
export const RESET_DESRCIPTION = 'RESET_DESCRIPTION'

export function setDescription(payload: string) {
    return {
        type: SET_DESCRIPTION,
        payload: payload
    }
}

export function resetDescription() {
    return {
        type: RESET_DESRCIPTION
    }
}

const initialState = '';

export default function descriptionReducer(state = initialState, action: ActionProps) {
    switch (action.type) {
        case APPLY_SNAPSHOT:
            return action.payload.description

        case SET_DESCRIPTION:
            return action.payload

        case RESET_STORE:
            return initialState;

        default:
            return state
    }
}