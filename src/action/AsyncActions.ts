import * as SyncActions from './SyncActions';
import Ajax, {params} from '../util/Ajax';
import {Dispatch} from "redux";

/*
 * Asynchronous actions involve requests to the backend server REST API. As per recommendations in the Redux docs, this consists
 * of several synchronous sub-actions which inform the application of initiation of the request and its result.
 */

export function fetchUser() {
    return (dispatch: Dispatch) => {
        dispatch(SyncActions.fetchUserRequest());
        Ajax.get('/users/current')
            .then(user => dispatch(SyncActions.fetchUserSuccess(user)))
            .catch((error) => dispatch(SyncActions.fetchUserFailure(error)));
    }
}

export function login(username: string, password: string) {
    return (dispatch: Dispatch) => {
        dispatch(SyncActions.loginRequest());
        Ajax.post('/j_spring_security_check', params({username, password}))
            .then(() => dispatch(SyncActions.loginSuccess()))
            .catch((error) => dispatch(SyncActions.loginFailure(error)));
        return null;
    }
}