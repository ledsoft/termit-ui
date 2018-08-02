import reducers from '../TermItReducers';
import ActionType, {FailureAction, UserLoadingAction} from "../../action/ActionType";
import TermItState from "../../model/TermItState";
import {fetchUserFailure, fetchUserRequest, fetchUserSuccess} from "../../action/SyncActions";
import ErrorInfo from "../../model/ErrorInfo";
import User from "../../model/User";

function stateToPlainObject(state: TermItState) {
    return {
        loading: state.loading,
        user: state.user,
        error: state.error
    };
}

describe('Reducers', () => {

    let initialState = new TermItState();

    beforeEach(() => {
        initialState = new TermItState();
    });

    describe('loading user', () => {
        it('sets user in state on user load success', () => {
            const user = new User({
                uri: 'http://test',
                firstName: 'test',
                lastName: 'test',
                username: 'test@kbss.felk.cvut.cz'
            });
            const action: UserLoadingAction = fetchUserSuccess(user);
            expect(reducers(undefined, action)).toEqual(Object.assign({}, initialState, {user}));
        });

        it('sets error in state on user load failure', () => {
            const error = new ErrorInfo(ActionType.FETCH_USER_FAILURE, {
                message: 'Failed to connect to server',
                requestUrl: '/users/current'
            });
            const action: FailureAction = fetchUserFailure(error);
            expect(reducers(undefined, action)).toEqual(Object.assign({}, initialState, {error}));
        });

        it('sets loading status when user fetch is initiated', () => {
            const action = fetchUserRequest();
            expect(reducers(undefined, action)).toEqual(Object.assign({}, initialState, {loading: true}));
        });

        it('sets loading status to false on user load success', () => {
            const user = new User({
                uri: 'http://test',
                firstName: 'test',
                lastName: 'test',
                username: 'test@kbss.felk.cvut.cz'
            });
            const action: UserLoadingAction = fetchUserSuccess(user);
            initialState.loading = true;
            expect(reducers(stateToPlainObject(initialState), action)).toEqual(Object.assign({}, initialState, {
                user,
                loading: false
            }));
        });

        it('sets loading status to false on user load failure', () => {
            const error = new ErrorInfo(ActionType.FETCH_USER_FAILURE, {
                message: 'Failed to connect to server',
                requestUrl: '/users/current'
            });
            const action: FailureAction = fetchUserFailure(error);
            initialState.loading = true;
            expect(reducers(stateToPlainObject(initialState), action)).toEqual(Object.assign({}, initialState, {
                error,
                loading: false
            }));
        });
    });
});