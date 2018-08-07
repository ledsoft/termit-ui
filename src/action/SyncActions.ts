import ActionType, {
    Action,
    ClearErrorAction,
    FailureAction,
    MessageAction,
    SwitchLanguageAction,
    UserLoadingAction
} from './ActionType';
import ErrorInfo from "../model/ErrorInfo";
import User from "../model/User";
import Message from "../model/Message";

/*
 * The most basic Redux actions. Each function exported from here returns an action object which is directly dispatched by Redux.
 */

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
