import ErrorInfo from "../model/ErrorInfo";
import User from "../model/User";

export interface Action {
    type: string
}

export interface UserLoadingAction extends Action {
    user: User
}

export interface FailureAction extends Action {
    error: ErrorInfo
}

export default {
    LOAD_USER: 'LOAD_USER',
    FETCH_USER_REQUEST: 'FETCH_USER_REQUEST',
    FETCH_USER_FAILURE: 'FETCH_USER_FAILURE',
    FETCH_USER_SUCCESS: 'FETCH_USER_SUCCESS',

    LOGIN: 'LOGIN',
    LOGIN_REQUEST: 'LOGIN_REQUEST',
    LOGIN_FAILURE: 'LOGIN_REQUEST_FAILURE',
    LOGIN_SUCCESS: 'LOGIN_REQUEST_SUCCESS'
}