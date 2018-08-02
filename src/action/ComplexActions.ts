import * as AsyncActions from './AsyncActions';
import {ThunkDispatch} from "redux-thunk";
import {Action} from 'redux';

export function loadUser() {
    return (dispatch: ThunkDispatch<object, undefined, Action>) => {
        dispatch(AsyncActions.fetchUser());
    }
}

export function login(username: string, password: string) {
    return (dispatch: ThunkDispatch<object, undefined, Action>) => {
        dispatch(AsyncActions.login(username, password));
    }
}

