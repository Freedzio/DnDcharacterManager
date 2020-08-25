import { createStore, combineReducers} from 'redux';
import characterIdReducer from './characterId';

const rootReducer = combineReducers({
    characterId: characterIdReducer
})

const store = createStore(rootReducer);

export default store