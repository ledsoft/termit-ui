import reducers from '../TermItReducers';
import ActionType, {FailureAction, UserLoadingAction} from "../../action/ActionType";
import TermItState from "../../model/TermItState";
import {
    clearError, dismissMessage,
    fetchUserFailure,
    fetchUserRequest,
    fetchUserSuccess, loginFailure,
    loginRequest,
    loginSuccess, publishMessage
} from "../../action/SyncActions";
import ErrorInfo, {EMPTY_ERROR} from "../../model/ErrorInfo";
import User from "../../model/User";
import Message from "../../model/Message";

function stateToPlainObject(state: TermItState) {
    return {
        loading: state.loading,
        user: state.user,
        error: state.error,
        messages: state.messages
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

    describe('login', () => {
        it('sets loading status on login request', () => {
            const action = loginRequest();
            expect(reducers(stateToPlainObject(initialState), action)).toEqual(Object.assign({}, initialState, {loading: true}));
        });

        it('sets loading status to false on login success', () => {
            const action = loginSuccess();
            initialState.loading = true;
            expect(reducers(stateToPlainObject(initialState), action)).toEqual(Object.assign({}, initialState, {loading: false}));
        });

        it('sets loading status to false on login failure', () => {
            const error = new ErrorInfo(ActionType.LOGIN_FAILURE, {
                message: 'Incorrect password',
                requestUrl: '/j_spring_security_check'
            });
            const action = loginFailure(error);
            initialState.loading = true;
            expect(reducers(stateToPlainObject(initialState), action)).toEqual(Object.assign({}, initialState, {
                loading: false,
                error
            }));
        });

        it('sets error state on login failure', () => {
            const error = new ErrorInfo(ActionType.LOGIN_FAILURE, {
                message: 'Incorrect password',
                requestUrl: '/j_spring_security_check'
            });
            const action = loginFailure(error);
            expect(reducers(stateToPlainObject(initialState), action)).toEqual(Object.assign({}, initialState, {error}));
        });
    });

    describe('clear error', () => {
        it('clears error when action origin matches', () => {
            initialState.error = new ErrorInfo(ActionType.LOGIN_FAILURE, {
                messageId: 'Unable to connect to server'
            });
            const action = clearError(ActionType.LOGIN_FAILURE);
            expect(reducers(stateToPlainObject(initialState), action)).toEqual(Object.assign({}, initialState, {error: EMPTY_ERROR}));
        });

        it('des not clear error when origin is different', () => {
            initialState.error = new ErrorInfo(ActionType.LOGIN_FAILURE, {
                messageId: 'Unable to connect to server'
            });
            const action = clearError(ActionType.FETCH_USER_FAILURE);
            expect(reducers(stateToPlainObject(initialState), action)).toEqual(stateToPlainObject(initialState));
        });
    });

    describe('messages', () => {
        it('adds message into message array on publish message action', () => {
            const mOne = new Message({
                message: 'test'
            });
            const action = publishMessage(mOne);
            expect(reducers(stateToPlainObject(initialState), action)).toEqual(Object.assign({}, initialState, {messages: [mOne]}));
            const mTwo = new Message({
                messageId: 'connection.error'
            });
            const actionTwo = publishMessage(mTwo);
            initialState.messages = [mOne];
            expect(reducers(stateToPlainObject(initialState), actionTwo)).toEqual(Object.assign({}, initialState, {messages: [mOne, mTwo]}));
        });

        it('removes message from array on dismiss message action', () => {
            const mOne = new Message({
                message: 'test'
            });
            const mTwo = new Message({
                messageId: 'connection.error'
            });
            initialState.messages = [mOne, mTwo];
            const action = dismissMessage(mOne);
            expect(reducers(stateToPlainObject(initialState), action)).toEqual(Object.assign({}, initialState, {messages: [mTwo]}));
        });
    });
});