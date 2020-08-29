export const SET_CLASS = 'SET_CLASS';
export const RESET_CLASS = 'RESET_CLASS';

export function setClass(characterClass: string) {
    return {
        type: SET_CLASS,
        payload: characterClass
    }
};

export function resetRace() {
    return {
        action: RESET_CLASS
    }
};

const initialState = '';

export default function classReducer(state = initialState, action: any) {
    switch (action.type) {
        case SET_CLASS:
            return action.payload;

        case RESET_CLASS:
            return initialState;

        default:
            return state
    }
}