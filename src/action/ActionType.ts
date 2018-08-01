export interface Action {
    type: string
}

export interface UserLoadingAction extends Action {
    user: object
}

export interface FailureAction extends Action {
    error: object
}

export default {
    LOAD_USER: 'LOAD_USER',
    FETCH_USER_REQUEST: 'FETCH_USER_REQUEST',
    FETCH_USER_FAILURE: 'FETCH_USER_FAILURE',
    FETCH_USER_SUCCESS: 'FETCH_USER_SUCCESS'
}