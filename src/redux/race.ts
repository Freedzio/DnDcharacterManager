import { act } from "react-test-renderer";
import { APPLY_SNAPSHOT } from "./snapshot";

export const SET_RACE = 'SET_RACE';
export const RESET_RACE = 'RESET_RACE';

export function setRace(race: string) {
    return {
        type: SET_RACE,
        payload: race
    }
};

export function resetRace() {
    return {
        action: RESET_RACE
    }
};

const initialState = '';

export default function raceReducer(state = initialState, action: any) {
    switch (action.type) {
        case APPLY_SNAPSHOT:
            return action.payload.race

        case SET_RACE:
            return action.payload;

        case RESET_RACE:
            return initialState;

        default:
            return state
    }
}