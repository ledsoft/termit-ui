import ActionType from './ActionType';

export function fetchUserRequest() {
    return {
        type: ActionType.FETCH_USER_REQUEST
    };
}

export function fetchUserSuccess(data: {}) {
    return {
        type: ActionType.FETCH_USER_SUCCESS,
        user: data
    };
}

export function fetchUserFailure(error: {}) {
    return {
        type: ActionType.FETCH_USER_FAILURE,
        error
    };
}