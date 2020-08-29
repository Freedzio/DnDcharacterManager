import { createStore, combineReducers} from 'redux';
import characterIdReducer from './characterId';
import reactotron from '../../ReactotronConfig';
import raceReducer from './class';
import classReducer from './race';

const rootReducer = combineReducers({
    characterId: characterIdReducer,
    race: raceReducer,
    class: classReducer
})

const store = createStore(rootReducer, reactotron.createEnhancer());

export default store

export interface StoreProps {
    characterId: string,
    class: string,

}