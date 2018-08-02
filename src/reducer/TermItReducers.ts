import {combineReducers} from "redux";
import ActionType, {Action, ClearErrorAction, FailureAction, UserLoadingAction} from '../action/ActionType';
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
        case ActionType.LOGIN_REQUEST:
            return true;
        case ActionType.FETCH_USER_FAILURE:
        case ActionType.FETCH_USER_SUCCESS:
        case ActionType.LOGIN_FAILURE:
        case ActionType.LOGIN_SUCCESS:
            return false;
        default:
            return state;
    }
}

function error(state: ErrorInfo = EMPTY_ERROR, action: Action): ErrorInfo {
    switch (action.type) {
        case ActionType.FETCH_USER_FAILURE:
        case ActionType.LOGIN_FAILURE:
            return (action as FailureAction).error;
        case ActionType.CLEAR_ERROR:
            const errAction = action as ClearErrorAction;
            return errAction.origin === state.origin ? EMPTY_ERROR : state;
        default:
            return state;
    }
}


const rootReducer = combineReducers<TermItState>({user, loading, error});

export default rootReducer;