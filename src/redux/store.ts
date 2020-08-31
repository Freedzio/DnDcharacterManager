import { createStore, combineReducers} from 'redux';
import reactotron from '../../ReactotronConfig';
import raceReducer from './class';
import classReducer from './race';
import nameReducer from './name';
import abilityScoresReducer from './abilityScores';
import basicInfoReducer, { BasicInfo } from './basicInfo';
import languagesReducer from './languages';
import proficienciesReducer from './proficiencies';
import traitssReducer from './traits';
import { AbilityScores, Proficiency, Trait } from '../common/models/models';

const rootReducer = combineReducers({
    race: raceReducer,
    class: classReducer,
    name: nameReducer,
    abilityScores: abilityScoresReducer,
    basicInfo: basicInfoReducer,
    languages: languagesReducer,
    proficiencies: proficienciesReducer,
    traits: traitssReducer
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
    }
}

export interface ActionProps {
    type: string,
    payload: any
}