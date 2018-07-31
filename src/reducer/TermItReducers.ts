import {combineReducers} from "redux";
import ActionType from '../action/ActionType';

function user(state = null, action: {type: string}) {
    switch (action.type) {
        case ActionType.FETCH_USER_SUCCESS:
            return action.user;
        default:
            return state;
    }
}


const rootReducer = combineReducers(user);

export default rootReducer;