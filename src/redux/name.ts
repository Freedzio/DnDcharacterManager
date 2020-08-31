import { ActionProps } from "./store";

export const SET_NAME = 'SET_NAME';
export const RESET_NAME = 'RESET_NAME';

export function setName(name: string) {
    return {
        type: SET_NAME,
        payload: name
    }
}

const initialState = '';

export default function nameReducer(state = initialState, action: ActionProps) {
    switch (action.type) {
        case SET_NAME:
            return action.payload

            case RESET_NAME: 
                return initialState

        default:
            return state
    }
}