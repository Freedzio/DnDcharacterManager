import { AbilityScores, Proficiency, Trait, EqItem } from '../common/models/models';
import basicInfoReducer, { BasicInfo } from './basicInfo';
import { createStore, combineReducers } from 'redux';
import proficienciesReducer from './proficiencies';
import abilityScoresReducer from './abilityScores';
import reactotron from '../../ReactotronConfig';
import languagesReducer from './languages';
import snapshotReducer from './snapshot';
import loadingReducer from './loading';
import hitDieReducer from './hitDie';
import traitsReducer from './traits';
import classReducer from './class';
import nameReducer from './name';
import itemsReducer from './items';
import raceReducer from './race';
import skillsReducer from './skills';

const rootReducer = combineReducers({
    race: raceReducer,
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
    items: itemsReducer,
    skills: skillsReducer
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
    skills: Array<string>
    snapshot: StoreProps
}

export interface ActionProps {
    type: string,
    payload: any
}