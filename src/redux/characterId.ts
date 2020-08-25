import { act } from "react-test-renderer";

export const SET_ID = "SET_ID";
export const RESET_ID = "RESET_ID";

export function setId(id: string) {
    return {
        type: SET_ID,
        payload: id
    }
};

export function resetId() {
    return {
        type: RESET_ID
    }
};

const initialState = '';

export default function characterIdReducer(state = initialState, action: any) {
    switch (action.type) {
        case SET_ID:
            return action.payload

        case RESET_ID:
            return initialState

        default:
            return state
    }
}