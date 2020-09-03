import { ActionProps } from "./store";
import { AbilityScores, JustUrl } from "../common/models/models";
import { APPLY_SNAPSHOT } from "./snapshot";

export const SET_ALL_ABILITY_SCORES = 'SET_ALL_ABILITY_SCORES';
export const RESET_ABILITY_SCORES = 'RESET_ABILITY_SCORES';
export const SET_ABILITY_SCORE = 'SET_ABILITY_SCORE';
export const SET_ABILITY_PROFICIENCIES = 'SET_ABILITY_PROFICIENCIES';

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

export function setAbilityProficiencies(payload: Partial<AbilityScores>) {
    return {
        type: SET_ABILITY_PROFICIENCIES,
        payload: payload
    }
}

const initialState: AbilityScores = {
    'STR': {
        score: 0,
        proficiency: false
    },
    'DEX': {
        score: 0,
        proficiency: false
    },
    'CON': {
        score: 0,
        proficiency: false
    },
    'WIS': {
        score: 0,
        proficiency: false
    },
    'INT': {
        score: 0,
        proficiency: false
    },
    'CHA': {
        score: 0,
        proficiency: false
    }
}

export default function abilityScoresReducer(state = initialState, action: ActionProps) {
    let newState: AbilityScores
    let keys: Array<string>
    let key: string;

    switch (action.type) {
        case APPLY_SNAPSHOT:
            return action.payload.abilityScores

        case SET_ALL_ABILITY_SCORES:
            return action.payload

        case SET_ABILITY_SCORE:
            newState = { ...state }
            keys = Object.keys(action.payload)

            for (let i = 0; i < keys.length; i++) {
                key = keys[i];
                const temp = state[key].score;
                
                newState = {
                    ...newState,
                    [key]: {
                        ...newState[key],
                        score: temp + action.payload[key].score
                    }
                }
            }

            return { ...newState }

        case SET_ABILITY_PROFICIENCIES:
            newState = { ...state }
            keys = Object.keys(action.payload)

            for (let i = 0; i < keys.length; i++) {
                key = keys[i];
                newState = {
                    ...newState,
                    [key]: {
                        ...newState[key],
                        proficiency: action.payload[key].proficiency
                    }
                }
            }

            return { ...newState }

        case RESET_ABILITY_SCORES:
            return initialState

        default:
            return state
    }
}
