import reducers from '../TermItReducers';
import ActionType, {FailureAction, UserLoadingAction} from "../../action/ActionType";
import TermItState from "../../model/TermItState";
import {
    clearError, clearSearchResults,
    dismissMessage,
    fetchUserFailure,
    fetchUserRequest,
    fetchUserSuccess, loadDefaultTerms, loadVocabularyFailure, loadVocabularySuccess,
    loginFailure,
    loginRequest,
    loginSuccess,
    publishMessage, registerFailure, selectVocabularyTerm,
    switchLanguage, userLogout
} from "../../action/SyncActions";
import ErrorInfo, {EMPTY_ERROR} from "../../model/ErrorInfo";
import User, {EMPTY_USER} from "../../model/User";
import Message from "../../model/Message";
import Constants from "../../util/Constants";
import Vocabulary, {VocabularyData} from "../../model/Vocabulary";
import AsyncActionStatus from "../../action/AsyncActionStatus";
import VocabularyTerm, {VocabularyTermData} from "../../model/VocabularyTerm";
import SearchResult from "../../model/SearchResult";

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
        searchResults: state.searchResults,
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
        it('sets user in state on user load success', () => {
            const user = new User({
                iri: 'http://test',
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
                iri: 'http://test',
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

        it('does not clear error when origin is different', () => {
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

    describe('intl', () => {
        it('loads localization data on action', () => {
            const action = switchLanguage(Constants.LANG.CS);
            expect(reducers(stateToPlainObject(initialState), action)).toEqual(Object.assign({}, initialState, {intl: require('../../i18n/cs').default}));
        });
    });

    describe('register', () => {
        it('sets error state on registration failure', () => {
            const error = new ErrorInfo(ActionType.REGISTER_FAILURE, {
                message: 'Username exists',
                requestUrl: '/users'
            });
            const action = registerFailure(error);
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
        it('sets vocabulary when it was successfully loaded', () => {
            const vocabularyData: VocabularyData = {
                name: 'Test vocabulary',
                iri: 'http://onto.fel.cvut.cz/ontologies/termit/vocabulary/test-vocabulary'
            };
            expect(reducers(stateToPlainObject(initialState), loadVocabularySuccess(vocabularyData)))
                .toEqual(Object.assign({}, initialState, {vocabulary: new Vocabulary(vocabularyData)}));
        });

        it('sets error when vocabulary loading fails', () => {
            const errorData = {
                message: 'Vocabulary does not exist',
                requestUri: '/vocabularies/unknown-vocabulary'
            };
            expect(reducers(stateToPlainObject(initialState), loadVocabularyFailure(errorData)))
                .toEqual(Object.assign({}, initialState, {error: new ErrorInfo(ActionType.LOAD_VOCABULARY_FAILURE, errorData)}));
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
            expect(reducers(stateToPlainObject(initialState), loadDefaultTerms(terms)))
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

    describe('clear search results', () => {
        it('resets search results to initial state', () => {
            initialState.searchResults = [new SearchResult({
                iri: 'http://test',
                label: 'test',
                types: ['http://term']
            })];
            expect(reducers((stateToPlainObject(initialState)), clearSearchResults())).toEqual(Object.assign({}, initialState, {searchResults: null}));
        });
    });
});