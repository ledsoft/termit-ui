import {combineReducers} from "redux";
import ActionType, {Action, FailureAction, UserLoadingAction} from '../action/ActionType';
import TermItState from "../model/TermItState";
import User, {EMPTY_USER} from "../model/User";
import ErrorInfo, {EMPTY_ERROR} from "../model/ErrorInfo";

function user(state: User = EMPTY_USER, action: UserLoadingAction): User {
    switch (action.type) {
        case ActionType.FETCH_USER_SUCCESS:
            return action.user;
        default:
            return state;
    }
}

function loading(state = false, action: Action): boolean {
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

function error(state: ErrorInfo = EMPTY_ERROR, action: FailureAction): ErrorInfo {
    switch (action.type) {
        case ActionType.FETCH_USER_FAILURE:
            return action.error;
        default:
            return state;
    }
}


const rootReducer = combineReducers<TermItState>({user, loading, error});

export default rootReducer;