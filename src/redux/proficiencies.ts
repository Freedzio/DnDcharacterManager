import { Proficiency } from "../common/models/models";

export const ADD_PROFICIENCY = 'ADD_PROFICIENCY';
export const RESET_PROFICIENCIES = 'RESET_PROFICIENCIES';
export const DELETE_PROFICIENCY = 'DELETE_PRPOFICIENCY';

export function addProficiency(payload: Array<Proficiency>) {
    return {
        type: ADD_PROFICIENCY,
        payload: payload
    }
}

export  function resetProficiencies() {
    return {
        type: RESET_PROFICIENCIES
    }
}

export function deleteProficiency(payload: Array<string>) {
    return {
        type: DELETE_PROFICIENCY,
        payload: payload
    }
}