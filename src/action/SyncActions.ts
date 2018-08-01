import ActionType, {FailureAction, UserLoadingAction} from './ActionType';

export function fetchUserRequest() {
    return {
        type: ActionType.FETCH_USER_REQUEST
    };
}

export function fetchUserSuccess(data: {}): UserLoadingAction {
    return {
        type: ActionType.FETCH_USER_SUCCESS,
        user: data
    };
}

export function fetchUserFailure(error: {}): FailureAction {
    return {
        type: ActionType.FETCH_USER_FAILURE,
        error
    };
}