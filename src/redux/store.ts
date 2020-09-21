import { AbilityScores, Proficiency, Trait, EqItem, Feature, Character, Armor, Weapon, AdventuringGear, Spell, ClassSpecific, Spellcasting, SpellcastingByLevel } from '../common/models/models';
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
import { APPLY_CHARACTER, RESET_STORE } from '../common/constants/storeCommons';
import idReducer from './id';
import maxHPReducer from './maxHP';
import equippedReducer from './equipped';
import spellsReducer from './spells';
import classSpecificReducer from './classSpecific';
import spellcastingReducer from './spellcasting';

const rootReducer = combineReducers({
    id: idReducer,
    name: nameReducer,
    race: raceReducer,
    basicInfo: basicInfoReducer,
    maxHP: maxHPReducer,
    classes: classReducer,
    abilityScores: abilityScoresReducer,
    languages: languagesReducer,
    proficiencies: proficienciesReducer,
    traits: traitsReducer,
    hitDies: hitDieReducer,
    loading: loadingReducer,
    items: itemsReducer,
    equipped: equippedReducer,
    skills: skillsReducer,
    expertises: expertiseReducer,
    features: featuresReducer,
    spells: spellsReducer,
    spellcasting: spellcastingReducer,
    classSpecifics: classSpecificReducer,
    snapshot: snapshotReducer
});

const store = createStore(rootReducer, reactotron.createEnhancer());

export default store

export interface StoreProps {
    id: string
    name: string,
    race: string,
    subrace: string,
    maxHP: number,
    classes: { [key: string]: number },
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
    spells: {
        [key: string]: Spell
    }
    spellcasting: {
        [classId: string]: SpellcastingByLevel
    }
    items: {
        [index: string]: Armor & Weapon & AdventuringGear
    }
    equipped: Array<string>
    skills: Array<string>
    expertises: Array<string>
    features: {
        [index: string]: Feature
    }
    classSpecifics: ClassSpecific
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

export function applyCharacter(payload: Character) {
    return {
        type: APPLY_CHARACTER,
        payload: payload
    }
}

