import { ActionProps } from './store'
import { APPLY_SNAPSHOT } from './snapshot';
import { APPLY_CHARACTER, RESET_STORE } from "../common/constants/storeCommons";

export const SET_BASIC_INFO = 'SET_BASIC_INFO';
export const RESET_BASIC_INFO = 'RESET_BASIC_INFO';
export const UPDATE_BASIC_INFO = 'UPDATE_BASIC_INFO';

export function setBasicInfo(payload: BasicInfo) {
    return {
        type: SET_BASIC_INFO,
        payload: payload
    }
}

export function updateBasicInfo(payload: Partial<BasicInfo>) {
    return {
        type: UPDATE_BASIC_INFO,
        payload: payload
    }
}

export function resetBasicInfo() {
    return {
        type: RESET_BASIC_INFO
    }
}

const initalState = {
    speed: 0,
    alignment: '',
    age: 0,
    size: '',
    proficiencyBonus: 0
}

export default function basicInfoReducer(state = initalState, action: ActionProps) {
    switch (action.type) {
        case APPLY_CHARACTER:
            return action.payload.basicInfo
            
        case APPLY_SNAPSHOT:
            return action.payload.basicInfo

        case SET_BASIC_INFO:
            return action.payload

        case UPDATE_BASIC_INFO:
            return {
                ...state,
                ...action.payload
            }

        case RESET_STORE:
            return initalState

        default:
            return state
    }
}


export interface BasicInfo {
    speed: number,
    alignment?: string,
    age?: number,
    size: string,
    proficiencyBonus: number
}