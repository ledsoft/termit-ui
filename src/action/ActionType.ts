import ErrorInfo from "../model/ErrorInfo";
import User from "../model/User";
import Message from "../model/Message";
import AsyncActionStatus from "./AsyncActionStatus";

export interface Action {
    type: string
}

export interface AsyncAction extends Action {
    status: AsyncActionStatus
}

export interface UserLoadingAction extends AsyncAction {
    user: User
}

export interface FailureAction extends Action {
    error: ErrorInfo
}

export interface AsyncFailureAction extends AsyncAction, FailureAction {
}

export interface ClearErrorAction extends Action {
    origin: string
}

export interface MessageAction extends Action {
    message: Message
}

export interface SwitchLanguageAction extends Action {
    language: string
}

export default {
    FETCH_USER_REQUEST: 'FETCH_USER_REQUEST',
    FETCH_USER_FAILURE: 'FETCH_USER_FAILURE',
    FETCH_USER_SUCCESS: 'FETCH_USER_SUCCESS',

    LOGIN_REQUEST: 'LOGIN_REQUEST',
    LOGIN_FAILURE: 'LOGIN_REQUEST_FAILURE',
    LOGIN_SUCCESS: 'LOGIN_REQUEST_SUCCESS',

    REGISTER_REQUEST: 'REGISTER_REQUEST',
    REGISTER_FAILURE: 'REGISTER_FAILURE',
    REGISTER_SUCCESS: 'REGISTER_SUCCESS',

    CLEAR_ERROR: 'CLEAR_ERROR',

    PUBLISH_MESSAGE: 'PUBLISH_MESSAGE',
    DISMISS_MESSAGE: 'DISMISS_MESSAGE',

    SWITCH_LANGUAGE: 'SWITCH_LANGUAGE',

    CREATE_VOCABULARY_REQUEST: 'CREATE_VOCABULARY_REQUEST',
    CREATE_VOCABULARY_SUCCESS: 'CREATE_VOCABULARY_SUCCESS',
    CREATE_VOCABULARY_FAILURE: 'CREATE_VOCABULARY_FAILURE',

    LOAD_VOCABULARY_REQUEST: 'LOAD_VOCABULARY_REQUEST',
    LOAD_VOCABULARY_SUCCESS: 'LOAD_VOCABULARY_SUCCESS',
    LOAD_VOCABULARY_FAILURE: 'LOAD_VOCABULARY_FAILURE',

    LOGOUT: 'LOGOUT'
}