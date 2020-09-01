import { AbilityScores, Proficiency, Trait } from '../common/models/models';
import basicInfoReducer, { BasicInfo } from './basicInfo';
import { createStore, combineReducers } from 'redux';
import proficienciesReducer from './proficiencies';
import abilityScoresReducer from './abilityScores';
import reactotron from '../../ReactotronConfig';
import languagesReducer from './languages';
import snapshotReducer from './snapshot';
import traitsReducer from './traits';
import raceReducer from './class';
import classReducer from './race';
import nameReducer from './name';

const rootReducer = combineReducers({
    race: raceReducer,
    class: classReducer,
    name: nameReducer,
    abilityScores: abilityScoresReducer,
    basicInfo: basicInfoReducer,
    languages: languagesReducer,
    proficiencies: proficienciesReducer,
    traits: traitsReducer,
    snapshot: snapshotReducer
})

const store = createStore(rootReducer, reactotron.createEnhancer());

export default store

export interface StoreProps {
    class: string,
    race: string,
    name: string,
    abilityScores: AbilityScores,
    basicInfo: BasicInfo,
    languages: Array<string>,
    proficiencies: {
        [index: string]: Proficiency
    },
    traits: {
        [index: string]: Trait
    },
    snapshot: StoreProps
}

export interface ActionProps {
    type: string,
    payload: any
}