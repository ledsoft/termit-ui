import {combineReducers} from "redux";
import ActionType, {Action, FailureAction, UserLoadingAction} from '../action/ActionType';

function user(state = null, action: UserLoadingAction) {
    switch (action.type) {
        case ActionType.FETCH_USER_SUCCESS:
            return action.user;
        default:
            return state;
    }
}

function loading(state = false, action: Action) {
    switch (action.type) {
        case ActionType.FETCH_USER_REQUEST:
            return true;
        case ActionType.FETCH_USER_FAILURE:
        case ActionType.FETCH_USER_SUCCESS:
            return false;
        default:
            return state;
    }
}

function error(state = null, action: FailureAction) {
    switch (action.type) {
        case ActionType.FETCH_USER_FAILURE:
            return action.error;
        default:
            return state;
    }
}


const rootReducer = combineReducers({user, loading, error});

export default rootReducer;