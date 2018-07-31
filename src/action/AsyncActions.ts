import * as SyncActions from './SyncActions';
import Ajax from '../util/Ajax';

export function fetchUser() {
    return (dispatch: (x: {}) => void) => {
        dispatch(SyncActions.fetchUserRequest());
        Ajax.fetchUser()
            .then(user => dispatch(SyncActions.fetchUserSuccess(user)))
            .catch((error) => dispatch(SyncActions.fetchUserFailure(error)));
    }
}