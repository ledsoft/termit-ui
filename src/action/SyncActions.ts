import ActionType, {
    Action,
    AsyncAction,
    AsyncFailureAction,
    ClearErrorAction,
    FailureAction,
    MessageAction,
    SwitchLanguageAction,
    UserLoadingAction
} from './ActionType';
import ErrorInfo from "../model/ErrorInfo";
import User from "../model/User";
import Message from "../model/Message";
import AsyncActionStatus from "./AsyncActionStatus";

/*
 * The most basic Redux actions. Each function exported from here returns an action object which is directly dispatched by Redux.
 */

export function asyncActionRequest(a: Action): AsyncAction {
    return {...a, status: AsyncActionStatus.REQUEST}
}

export function asyncActionFailure(a: Action, error: {}): AsyncFailureAction {
    return {...a, status: AsyncActionStatus.FAILURE, error: new ErrorInfo(a.type, error)};
}

export function fetchUserRequest(): Action {
    return {
        type: ActionType.FETCH_USER_REQUEST
    };
}

export function fetchUserSuccess(data: User): UserLoadingAction {
    return {
        type: ActionType.FETCH_USER_SUCCESS,
        user: data
    };
}

export function fetchUserFailure(error: {}): FailureAction {
    return {
        type: ActionType.FETCH_USER_FAILURE,
        error: new ErrorInfo(ActionType.FETCH_USER_FAILURE, error)
    };
}

export function loginRequest(): Action {
    return {
        type: ActionType.LOGIN_REQUEST
    };
}

export function loginSuccess(): Action {
    return {
        type: ActionType.LOGIN_SUCCESS
    };
}

export function loginFailure(error: {}): FailureAction {
    return {
        type: ActionType.LOGIN_FAILURE,
        error: new ErrorInfo(ActionType.LOGIN_FAILURE, error)
    };
}

export function clearError(origin: string): ClearErrorAction {
    return {
        type: ActionType.CLEAR_ERROR,
        origin
    };
}

export function publishMessage(message: Message): MessageAction {
    return {
        type: ActionType.PUBLISH_MESSAGE,
        message
    };
}

export function dismissMessage(message: Message): MessageAction {
    return {
        type: ActionType.DISMISS_MESSAGE,
        message
    };
}

export function switchLanguage(language: string): SwitchLanguageAction {
    return {
        type: ActionType.SWITCH_LANGUAGE,
        language
    };
}

export function registerRequest(): Action {
    return {
        type: ActionType.REGISTER_REQUEST
    };
}

export function registerFailure(error: {}): FailureAction {
    return {
        type: ActionType.REGISTER_FAILURE,
        error: new ErrorInfo(ActionType.REGISTER_FAILURE, error)
    };
}

export function registerSuccess(): Action {
    return {
        type: ActionType.REGISTER_SUCCESS
    };
}

export function userLogout(): Action {
    return {
        type: ActionType.LOGOUT
    };
}

export function createVocabularyRequest() {
    return {
        type: ActionType.CREATE_VOCABULARY_REQUEST
    };
}

export function createVocabularyFailure(error: {}): FailureAction {
    return {
        type: ActionType.CREATE_VOCABULARY_FAILURE,
        error: new ErrorInfo(ActionType.CREATE_VOCABULARY_FAILURE, error)
    };
}

export function createVocabularySuccess(): Action {
    return {
        type: ActionType.CREATE_VOCABULARY_SUCCESS
    };
}
