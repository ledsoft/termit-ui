import reducers from '../TermItReducers';
import ActionType, {AsyncActionSuccess, FailureAction} from "../../action/ActionType";
import TermItState from "../../model/TermItState";
import {
    asyncActionFailure,
    asyncActionRequest,
    asyncActionSuccess,
    asyncActionSuccessWithPayload,
    clearError,
    dismissMessage,
    publishMessage,
    selectVocabularyTerm,
    switchLanguage,
    userLogout
} from "../../action/SyncActions";
import ErrorInfo, {EMPTY_ERROR} from "../../model/ErrorInfo";
import User, {EMPTY_USER} from "../../model/User";
import Message from "../../model/Message";
import Constants from "../../util/Constants";
import Vocabulary, {VocabularyData} from "../../model/Vocabulary";
import AsyncActionStatus from "../../action/AsyncActionStatus";
import VocabularyTerm, {VocabularyTermData} from "../../model/VocabularyTerm";

function stateToPlainObject(state: TermItState) {
    return {
        loading: state.loading,
        user: state.user,
        vocabulary: state.vocabulary,
        vocabularies: state.vocabularies,
        queryResults: state.queryResults,
        error: state.error,
        messages: state.messages,
        intl: state.intl,
        selectedTerm: state.selectedTerm,
        defaultTerms: state.defaultTerms,
        createdTermsCounter: state.createdTermsCounter,
        document: state.document,
        fileIri: state.fileIri,
        fileContent: state.fileContent
    };
}

describe('Reducers', () => {

    let initialState = new TermItState();

    beforeEach(() => {
        initialState = new TermItState();
    });

    describe('loading user', () => {
        const action = {type: ActionType.FETCH_USER};
        it('sets user in state on user load success', () => {
            const user = new User({
                iri: 'http://test',
                firstName: 'test',
                lastName: 'test',
                username: 'test@kbss.felk.cvut.cz'
            });
            const a: AsyncActionSuccess<User> = asyncActionSuccessWithPayload(action, user);
            expect(reducers(undefined, a)).toEqual(Object.assign({}, initialState, {user}));
        });

        it('sets error in state on user load failure', () => {
            const error = new ErrorInfo(ActionType.FETCH_USER, {
                message: 'Failed to connect to server',
                requestUrl: '/users/current'
            });
            const a: FailureAction = asyncActionFailure(action, error);
            expect(reducers(undefined, a)).toEqual(Object.assign({}, initialState, {error}));
        });

        it('sets loading status when user fetch is initiated', () => {
            const a = asyncActionRequest(action);
            expect(reducers(undefined, a)).toEqual(Object.assign({}, initialState, {loading: true}));
        });

        it('sets loading status to false on user load success', () => {
            const user = new User({
                iri: 'http://test',
                firstName: 'test',
                lastName: 'test',
                username: 'test@kbss.felk.cvut.cz'
            });
            const a: AsyncActionSuccess<User> = asyncActionSuccessWithPayload(action, user);
            initialState.loading = true;
            expect(reducers(stateToPlainObject(initialState), a)).toEqual(Object.assign({}, initialState, {
                user,
                loading: false
            }));
        });

        it('sets loading status to false on user load failure', () => {
            const error = new ErrorInfo(ActionType.FETCH_USER, {
                message: 'Failed to connect to server',
                requestUrl: '/users/current'
            });
            const a: FailureAction = asyncActionFailure(action, error);
            initialState.loading = true;
            expect(reducers(stateToPlainObject(initialState), a)).toEqual(Object.assign({}, initialState, {
                error,
                loading: false
            }));
        });
    });

    describe('login', () => {
        const action = {type: ActionType.LOGIN};
        it('sets loading status on login request', () => {
            const a = asyncActionRequest(action);
            expect(reducers(stateToPlainObject(initialState), a)).toEqual(Object.assign({}, initialState, {loading: true}));
        });

        it('sets loading status to false on login success', () => {
            const a = asyncActionSuccess(action);
            initialState.loading = true;
            expect(reducers(stateToPlainObject(initialState), a)).toEqual(Object.assign({}, initialState, {loading: false}));
        });

        it('sets loading status to false on login failure', () => {
            const error = new ErrorInfo(ActionType.LOGIN, {
                message: 'Incorrect password',
                requestUrl: '/j_spring_security_check'
            });
            const a = asyncActionFailure(action, error);
            initialState.loading = true;
            expect(reducers(stateToPlainObject(initialState), a)).toEqual(Object.assign({}, initialState, {
                loading: false,
                error
            }));
        });

        it('sets error state on login failure', () => {
            const error = new ErrorInfo(ActionType.LOGIN, {
                message: 'Incorrect password',
                requestUrl: '/j_spring_security_check'
            });
            const a = asyncActionFailure(action, error);
            expect(reducers(stateToPlainObject(initialState), a)).toEqual(Object.assign({}, initialState, {error}));
        });
    });

    describe('clear error', () => {
        it('clears error when action origin matches', () => {
            initialState.error = new ErrorInfo(ActionType.LOGIN, {
                messageId: 'Unable to connect to server'
            });
            const action = clearError(ActionType.LOGIN);
            expect(reducers(stateToPlainObject(initialState), action)).toEqual(Object.assign({}, initialState, {error: EMPTY_ERROR}));
        });

        it('does not clear error when origin is different', () => {
            initialState.error = new ErrorInfo(ActionType.LOGIN, {
                messageId: 'Unable to connect to server'
            });
            const action = clearError(ActionType.FETCH_USER);
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

    describe('intl', () => {
        it('loads localization data on action', () => {
            const action = switchLanguage(Constants.LANG.CS);
            expect(reducers(stateToPlainObject(initialState), action)).toEqual(Object.assign({}, initialState, {intl: require('../../i18n/cs').default}));
        });
    });

    describe('register', () => {
        it('sets error state on registration failure', () => {
            const error = new ErrorInfo(ActionType.REGISTER, {
                message: 'Username exists',
                requestUrl: '/users'
            });
            const action = asyncActionFailure({type: ActionType.REGISTER}, error);
            expect(reducers(stateToPlainObject(initialState), action)).toEqual(Object.assign({}, initialState, {error}));
        });
    });

    describe('logout', () => {
        it('resets current user to empty user', () => {
            initialState.user = new User({
                iri: 'http://test',
                firstName: 'test',
                lastName: 'test',
                username: 'test@kbss.felk.cvut.cz'
            });
            expect(reducers(stateToPlainObject(initialState), userLogout())).toEqual(Object.assign({}, initialState, {user: EMPTY_USER}));
        });
    });

    describe('loading vocabulary', () => {
        const action = {type: ActionType.LOAD_VOCABULARY};

        it('sets vocabulary when it was successfully loaded', () => {
            const vocabularyData: VocabularyData = {
                name: 'Test vocabulary',
                iri: 'http://onto.fel.cvut.cz/ontologies/termit/vocabulary/test-vocabulary'
            };
            expect(reducers(stateToPlainObject(initialState), asyncActionSuccessWithPayload(action, new Vocabulary(vocabularyData))))
                .toEqual(Object.assign({}, initialState, {vocabulary: new Vocabulary(vocabularyData)}));
        });

        it('sets error when vocabulary loading fails', () => {
            const errorData = {
                message: 'Vocabulary does not exist',
                requestUri: '/vocabularies/unknown-vocabulary'
            };
            expect(reducers(stateToPlainObject(initialState), asyncActionFailure(action, errorData)))
                .toEqual(Object.assign({}, initialState, {error: new ErrorInfo(ActionType.LOAD_VOCABULARY, errorData)}));
        });
    });

    describe('select term', () => {
        it('sets selectedTerm when it was successfully selected', () => {
            const term: VocabularyTermData = {
                label: 'Test term',
                iri: 'http://onto.fel.cvut.cz/ontologies/termit/vocabulary/test-vocabulary/term/test-term'
            };
            expect(reducers(stateToPlainObject(initialState), selectVocabularyTerm(term)))
                .toEqual(Object.assign({}, initialState, {selectedTerm: new VocabularyTerm(term)}));
        });

        it('sets selectedTerm when it was successfully selected then deselect it', () => {
            const term: VocabularyTermData = {
                label: 'Test term',
                iri: 'http://onto.fel.cvut.cz/ontologies/termit/vocabulary/test-vocabulary/term/test-term'
            };
            expect(reducers(stateToPlainObject(initialState), selectVocabularyTerm(term)))
                .toEqual(Object.assign({}, initialState, {selectedTerm: new VocabularyTerm(term)}));
            expect(reducers(stateToPlainObject(initialState), selectVocabularyTerm(null)))
                .toEqual(Object.assign({}, initialState, {selectedTerm: null}));
        });
    });

    describe('load default terms', () => {
        it('sets default terms when it was successfully loaded', () => {
            const terms: VocabularyTermData[] = [
                {
                    label: 'Test term 1',
                    iri: 'http://onto.fel.cvut.cz/ontologies/termit/vocabulary/test-vocabulary/term/test-term-1'
                },
                {
                    label: 'Test term 2',
                    iri: 'http://onto.fel.cvut.cz/ontologies/termit/vocabulary/test-vocabulary/term/test-term-2'
                }
            ];
            expect(reducers(stateToPlainObject(initialState), asyncActionSuccessWithPayload({type: ActionType.LOAD_DEFAULT_TERMS}, terms.map(vt => new VocabularyTerm(vt)))))
                .toEqual(Object.assign({}, initialState, {defaultTerms: terms.map(t => new VocabularyTerm(t))}));
        });
    });

    it('does not change loading status on request action with ignoreLoading specified', () => {
        const action = {
            type: ActionType.SEARCH,
            status: AsyncActionStatus.REQUEST,
            ignoreLoading: true
        };
        expect(reducers(stateToPlainObject(initialState), action)).toEqual(initialState);
    });
});