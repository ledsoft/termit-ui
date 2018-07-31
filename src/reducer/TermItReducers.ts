import {combineReducers} from "redux";
import ActionType, {Action} from '../action/ActionType';

function user(state = null, action: Action) {
    switch (action.type) {
        case ActionType.FETCH_USER_SUCCESS:
            return null;
        default:
            return state;
    }
}


const rootReducer = combineReducers(user);

export default rootReducer;