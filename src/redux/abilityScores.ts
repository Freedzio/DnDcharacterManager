import { ActionProps } from "./store";

export const SET_ALL_ABILITY_SCORES = 'SET_ALL_ABILITY_SCORES';
export const RESET_ABILITY_SCORES = 'RESET_ABILITY_SCORES';
export const SET_ABILITY_SCORE = 'SET_ABILITY_SCORE';

export function setAllAbilityScores(payload: AbilityScores) {
    return {
        type: SET_ALL_ABILITY_SCORES,
        payload: payload
    }
}

export function resetAbilityScores() {
    return {
        type: RESET_ABILITY_SCORES
    }
}

export function setAbilityScore(payload: Partial<AbilityScores>) {
    return {
        type: SET_ABILITY_SCORE,
        payload: payload
    }
}
const initialState = {
    STR: 0,
    DEX: 0,
    CON: 0,
    WIS: 0,
    INT: 0,
    CHA: 0
}

export default function abilityScoresReducer(state = initialState, action: ActionProps) {
    switch (action.type) {
        case SET_ALL_ABILITY_SCORES:
            return action.payload

        case SET_ABILITY_SCORE:
            var newState = { ...state }
            newState = {
                ...newState,
                ...action.payload
            }

            return { ...newState }

        case RESET_ABILITY_SCORES:
            return initialState

        default:
            return state
    }
}
