import ActionType from './ActionType';
import * as AsyncActions from './AsyncActions';

export function loadUser() {
    return (dispatch: (x: {}) => void) => {
        dispatch(AsyncActions.fetchUser())
    }
}

