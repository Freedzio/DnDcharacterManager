import { AbilityScores, Proficiency, Trait, EqItem } from '../common/models/models';
import basicInfoReducer, { BasicInfo } from './basicInfo';
import { createStore, combineReducers } from 'redux';
import proficienciesReducer from './proficiencies';
import abilityScoresReducer from './abilityScores';
import reactotron from '../../ReactotronConfig';
import languagesReducer from './languages';
import snapshotReducer, { APPLY_SNAPSHOT, TAKE_SNAPSHOT } from './snapshot';
import traitsReducer from './traits';
import raceReducer from './race';
import classReducer from './class';
import nameReducer from './name';
import { Reducer } from 'react';
import hitDieReducer from './hitDie';
import loadingReducer from './loading';
import subraceReducer from './subrace';
import itemsReducer from './items';

const rootReducer = combineReducers({
    race: raceReducer,
    subrace: subraceReducer,
    class: classReducer,
    name: nameReducer,
    abilityScores: abilityScoresReducer,
    basicInfo: basicInfoReducer,
    languages: languagesReducer,
    proficiencies: proficienciesReducer,
    traits: traitsReducer,
    snapshot: snapshotReducer,
    hitDie: hitDieReducer,
    loading: loadingReducer,
    items: itemsReducer
});

const store = createStore(rootReducer, reactotron.createEnhancer());

export default store

export interface StoreProps {
    class: string,
    race: string,
    subrace: string,
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
    hitDie: number
    loading: boolean
    items: {
        [index: string]: EqItem
    }
    snapshot: StoreProps
}

export interface ActionProps {
    type: string,
    payload: any
}