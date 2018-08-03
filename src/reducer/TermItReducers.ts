import {combineReducers} from "redux";
import ActionType, {
    Action,
    ClearErrorAction,
    FailureAction,
    MessageAction,
    UserLoadingAction
} from '../action/ActionType';
import TermItState from "../model/TermItState";
import User, {EMPTY_USER} from "../model/User";
import ErrorInfo, {EMPTY_ERROR} from "../model/ErrorInfo";
import Message from "../model/Message";

/**
 * Handles changes to the currently logged in user.
 *
 * The initial state is an empty user, which basically shouldn't be allowed to do anything.
 */
function user(state: User = EMPTY_USER, action: UserLoadingAction): User {
    switch (action.type) {
        case ActionType.FETCH_USER_SUCCESS:
            return action.user;
        default:
            return state;
    }
}

/**
 * Handling loading state.
 *
 * Currently, this state is represented by a single boolean switch. The assumption is that there will always be one
 * component aware of the loading status and that one should display the loading mask.
 *
 * NOTE: This strategy is highly likely to change as we might have multiple components loading data independently of
 * each other
 */
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

/**
 * Error status of the application.
 *
 * The store currently supports only one error, so if an error action is invoked, the previous error status is replaced
 * by the new one. The state holds structured information about the error itself and the action where the error
 * originated (usually an error action).
 */
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

function messages(state: Message[] = [], action: MessageAction): Message[] {
    switch (action.type) {
        case ActionType.PUBLISH_MESSAGE:
            return [...state, action.message];
        case ActionType.DISMISS_MESSAGE:
            const newArr = state.slice(0);
            newArr.splice(newArr.indexOf(action.message), 1);
            return newArr;
        default:
            return state;
    }
}


const rootReducer = combineReducers<TermItState>({user, loading, error, messages});

export default rootReducer;