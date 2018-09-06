import ActionType, {
    Action,
    AsyncAction,
    AsyncFailureAction,
    ClearErrorAction,
    MessageAction,
    SwitchLanguageAction,
    UserLoadingAction, VocabularyLoadingAction
} from './ActionType';
import ErrorInfo, {ErrorData} from "../model/ErrorInfo";
import User, {UserData} from "../model/User";
import Message from "../model/Message";
import AsyncActionStatus from "./AsyncActionStatus";
import Vocabulary, {VocabularyData} from "../model/Vocabulary";
import {saveLanguagePreference} from "../util/IntlUtil";

/*
 * The most basic Redux actions. Each function exported from here returns an action object which is directly dispatched by Redux.
 */

export function asyncActionRequest(a: Action): AsyncAction {
    return {...a, status: AsyncActionStatus.REQUEST};
}

export function asyncActionFailure(a: Action, error: ErrorData): AsyncFailureAction {
    return {...a, status: AsyncActionStatus.FAILURE, error: new ErrorInfo(a.type, error)};
}

export function fetchUserRequest(): AsyncAction {
    return asyncActionRequest({
        type: ActionType.FETCH_USER_REQUEST
    });
}

export function fetchUserSuccess(data: UserData): UserLoadingAction {
    return {
        type: ActionType.FETCH_USER_SUCCESS,
        status: AsyncActionStatus.SUCCESS,
        user: new User(data)
    };
}

export function fetchUserFailure(error: ErrorData): AsyncFailureAction {
    return asyncActionFailure({
        type: ActionType.FETCH_USER_FAILURE,
    }, error);
}

export function loginRequest(): AsyncAction {
    return asyncActionRequest({
        type: ActionType.LOGIN_REQUEST
    });
}

export function loginSuccess(): AsyncAction {
    return {
        type: ActionType.LOGIN_SUCCESS,
        status: AsyncActionStatus.SUCCESS
    };
}

export function loginFailure(error: ErrorData): AsyncFailureAction {
    return asyncActionFailure({
        type: ActionType.LOGIN_FAILURE
    }, error);
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
    saveLanguagePreference(language);
    return {
        type: ActionType.SWITCH_LANGUAGE,
        language
    };
}

export function registerRequest(): AsyncAction {
    return asyncActionRequest({
        type: ActionType.REGISTER_REQUEST
    });
}

export function registerFailure(error: ErrorData): AsyncFailureAction {
    return asyncActionFailure({
        type: ActionType.REGISTER_FAILURE,
    }, error);
}

export function registerSuccess(): AsyncAction {
    return {
        type: ActionType.REGISTER_SUCCESS,
        status: AsyncActionStatus.SUCCESS
    };
}

export function userLogout(): Action {
    return {
        type: ActionType.LOGOUT
    };
}

export function createVocabularyRequest(): AsyncAction {
    return asyncActionRequest({
        type: ActionType.CREATE_VOCABULARY_REQUEST
    });
}

export function createVocabularyFailure(error: ErrorData): AsyncFailureAction {
    return asyncActionFailure({
        type: ActionType.CREATE_VOCABULARY_FAILURE,
    }, error);
}

export function createVocabularySuccess(): AsyncAction {
    return {
        type: ActionType.CREATE_VOCABULARY_SUCCESS,
        status: AsyncActionStatus.SUCCESS
    };
}

export function loadVocabularyRequest(): AsyncAction {
    return asyncActionRequest({
        type: ActionType.LOAD_VOCABULARY_REQUEST
    });
}

export function loadVocabularySuccess(data: VocabularyData): VocabularyLoadingAction {
    return {
        type: ActionType.LOAD_VOCABULARY_SUCCESS,
        status: AsyncActionStatus.SUCCESS,
        vocabulary: new Vocabulary(data)
    }
}

export function loadVocabularyFailure(error: ErrorData): AsyncFailureAction {
    return asyncActionFailure({
        type: ActionType.LOAD_VOCABULARY_FAILURE
    }, error);
}
