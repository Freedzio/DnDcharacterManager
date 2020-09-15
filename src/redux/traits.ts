import { Trait } from "../common/models/models";
import { ActionProps} from "./store";
import { RESET_STORE } from "../common/constants/resetStore";
import mapArrayToObject from "../common/functions/mapArrayToObject";
import { APPLY_SNAPSHOT } from "./snapshot";

export const ADD_TRAITS = 'ADD_TRAITS';
export const RESET_TRAITS = 'RESET_TRAITS';
export const DELETE_TRAITS = 'DELETE_PRPOFICIENCIES';
export const HANDLE_DRACONIC = 'HANDLE_DRACONIC';

export function addTraits(payload: Array<Trait>) {
    return {
        type: ADD_TRAITS,
        payload: payload
    }
}

export function resetTraits() {
    return {
        type: RESET_TRAITS
    }
}

export function deleteTraits(payload: Array<string>) {
    return {
        type: DELETE_TRAITS,
        payload: payload
    }
}

export function handleDraconic(payload: string) {
    return {
        type: HANDLE_DRACONIC,
        payload: payload
    }
}

const initialState: { [index: string]: Trait } = {};

export default function traitsReducer(state = initialState, action: ActionProps) {
    switch (action.type) {
        case APPLY_SNAPSHOT:
            return action.payload.traits

        case ADD_TRAITS:
            var newState = { ...state };
            const incomingData = mapArrayToObject(action.payload)

            newState = {
                ...state,
                ...incomingData
            }

            return {
                ...newState
            }

        case DELETE_TRAITS:
            var newState = { ...state }

            for (let i = 0; i < action.payload.length; i++) {
                delete newState[action.payload[i]]
            }

        case RESET_STORE:
            return initialState

        case HANDLE_DRACONIC:
            var newState = { ...state }
            newState = {
                ...newState,
                ['breath-weapon']: {
                    ...newState['breath-weapon'],
                    name: `Breath Weapon ${action.payload}`
                }
            }
            return newState

        default:
            return state
    }
}