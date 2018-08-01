import * as AsyncActions from './AsyncActions';
import {ThunkDispatch} from "redux-thunk";
import {Action} from 'redux';

export function loadUser() {
    return (dispatch: ThunkDispatch<object, undefined, Action>) => {
        dispatch(AsyncActions.fetchUser());
    }
}

