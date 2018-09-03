import * as AsyncActions from './AsyncActions';
import {ThunkDispatch} from 'redux-thunk';
import {Action} from 'redux';
import Authentication from '../util/Authentication';
import {userLogout} from './SyncActions';
import Routes from '../util/Routes';
import Routing from '../util/Routing';
import Vocabulary from "../model/Vocabulary";

/*
 * Complex actions are basically just nice names for actions which involve both synchronous and asynchronous actions.
 * This way, the implementation details (e.g. that loginRequest means sending credentials to the server) do not leak into
 * the rest of the application.
 */

export function loadUser() {
    return (dispatch: ThunkDispatch<object, undefined, Action>) => {
        dispatch(AsyncActions.fetchUser());
    };
}

export function login(username: string, password: string) {
    return (dispatch: ThunkDispatch<object, undefined, Action>) => {
        dispatch(AsyncActions.login(username, password));
    };
}

export function register(user: { username: string, password: string }) {
    return (dispatch: ThunkDispatch<object, undefined, Action>) => {
        dispatch(AsyncActions.register(user));
    };
}

export function logout() {
    Authentication.clearToken();
    Routing.transitionTo(Routes.login);
    return (dispatch: ThunkDispatch<object, undefined, Action>) => {
        dispatch(userLogout());
    };
}

export function createVocabulary(vocabulary: Vocabulary) {
    return (dispatch: ThunkDispatch<object, undefined, Action>) => {
        dispatch(AsyncActions.createVocabulary(vocabulary));
    };
}

export function loadVocabulary(normalizedName: string) {
    return (dispatch: ThunkDispatch<object, undefined, Action>) => {
        dispatch(AsyncActions.loadVocabulary(normalizedName));
    };
}
