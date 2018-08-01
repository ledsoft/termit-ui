import * as SyncActions from './SyncActions';
import Ajax from '../util/Ajax';
import {Dispatch} from "redux";

export function fetchUser() {
    return (dispatch: Dispatch) => {
        dispatch(SyncActions.fetchUserRequest());
        Ajax.fetchUser()
            .then(user => dispatch(SyncActions.fetchUserSuccess(user)))
            .catch((error) => dispatch(SyncActions.fetchUserFailure(error)));
    }
}