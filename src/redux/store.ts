import { AbilityScores, Proficiency, Trait, EqItem, Feature } from '../common/models/models';
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
import featuresReducer from './features';
import expertiseReducer from './expertises'
import { RESET_STORE } from '../common/constants/resetStore';

const rootReducer = combineReducers({
    race: raceReducer,
    classes: classReducer,
    name: nameReducer,
    abilityScores: abilityScoresReducer,
    basicInfo: basicInfoReducer,
    languages: languagesReducer,
    proficiencies: proficienciesReducer,
    traits: traitsReducer,
    hitDies: hitDieReducer,
    loading: loadingReducer,
    items: itemsReducer,
    skills: skillsReducer,
    expertises: expertiseReducer,
    features: featuresReducer,
    snapshot: snapshotReducer,
});

const store = createStore(rootReducer, reactotron.createEnhancer());

export default store

export interface StoreProps {
    classes: { [key: string]: number },
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
    hitDies: {
        [key: string]: number
    }
    loading: boolean
    items: {
        [index: string]: EqItem
    }
    skills: Array<string>
    features: {
        [index: string]: Feature
    }
    snapshot: StoreProps
}

export interface ActionProps {
    type: string,
    payload: any
}

export function resetStore() {
    return {
        type: RESET_STORE
    }
}