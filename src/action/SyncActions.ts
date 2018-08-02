import ActionType, {FailureAction, UserLoadingAction} from './ActionType';
import ErrorInfo from "../model/ErrorInfo";
import User from "../model/User";

export function fetchUserRequest() {
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

export function fetchUserFailure(error: ErrorInfo): FailureAction {
    return {
        type: ActionType.FETCH_USER_FAILURE,
        error
    };
}