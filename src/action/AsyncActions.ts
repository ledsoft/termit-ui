import * as SyncActions from './SyncActions';
import Ajax, {content, params} from '../util/Ajax';
import {Action, Dispatch} from 'redux';
import {ThunkDispatch} from 'redux-thunk';
import Routing from '../util/Routing';
import Constants from '../util/Constants';
import Authentication from '../util/Authentication';

/*
 * Asynchronous actions involve requests to the backend server REST API. As per recommendations in the Redux docs, this consists
 * of several synchronous sub-actions which inform the application of initiation of the request and its result.
 */

export function fetchUser() {
    return (dispatch: Dispatch) => {
        dispatch(SyncActions.fetchUserRequest());
        Ajax.get(Constants.API_PREFIX + '/users/current')
            .then(user => dispatch(SyncActions.fetchUserSuccess(user)))
            .catch((error) => dispatch(SyncActions.fetchUserFailure(error)));
    }
}

export function login(username: string, password: string) {
    return (dispatch: Dispatch) => {
        dispatch(SyncActions.loginRequest());
        Ajax.post('/j_spring_security_check', params({username, password}))
            .then(resp => {
                const data = resp.data;
                if (!data.loggedIn) {
                    return Promise.reject(data);
                } else {
                    Routing.transitionToHome();
                    dispatch(SyncActions.loginSuccess());
                    Authentication.saveJwt(resp.headers[Constants.AUTHENTICATION_HEADER]);
                    return Promise.resolve();
                }
            }).catch((error: any) => dispatch(SyncActions.loginFailure(error)));
    }
}

export function register(user: { username: string, password: string }) {
    return (dispatch: ThunkDispatch<object, undefined, Action>) => {
        dispatch(SyncActions.loginRequest());
        Ajax.post(Constants.API_PREFIX + '/users', content(user).contentType('application/json'))
            .then(() => dispatch(SyncActions.registerSuccess()))
            .then(() => dispatch(login(user.username, user.password)))
            .catch((error) => dispatch(SyncActions.registerFailure(error)));
    }
}