import { Proficiency } from "../common/models/models";
import store, { ActionProps } from "./store";
import mapArrayToObject from "../common/functions/mapArrayToObject";
import { APPLY_SNAPSHOT } from "./snapshot";

export const ADD_PROFICIENCIES = 'ADD_PROFICIENCIES';
export const RESET_PROFICIENCIES = 'RESET_PROFICIENCIES';
export const DELETE_PROFICIENCIES = 'DELETE_PRPOFICIENCIES';

export function addProficiencies(payload: Array<Proficiency>) {
    return {
        type: ADD_PROFICIENCIES,
        payload: payload
    }
}

export function resetProficiencies() {
    return {
        type: RESET_PROFICIENCIES
    }
}

export function deleteProficiencies(payload: Array<string>) {
    return {
        type: DELETE_PROFICIENCIES,
        payload: payload
    }
}

const initialState: { [index: string]: Proficiency } = {};

export default function proficienciesReducer(state = initialState, action: ActionProps) {
    switch (action.type) {
        case APPLY_SNAPSHOT:
            const prevState = action.payload.proficiencies
            console.log(prevState)
            return prevState

        case ADD_PROFICIENCIES:
            var newState = { ...state };
            const incomingData = mapArrayToObject(action.payload)

            newState = {
                ...state,
                ...incomingData
            }

            return {
                ...newState
            }

        case DELETE_PROFICIENCIES:
            var newState = { ...state }

            for (let i = 0; i < action.payload.length; i++) {
                delete newState[action.payload[i]]
            }

        case RESET_PROFICIENCIES:
            return initialState

        default:
            return state
    }
}