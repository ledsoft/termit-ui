import configureMockStore from 'redux-mock-store';
import {
    createVocabulary,
    createVocabularyTerm,
    fetchVocabularyTerms,
    loadTypes,
    loadUser,
    loadVocabularies,
    loadVocabulary,
    loadVocabularyTerm,
    login,
    search,
    updateTerm,
    updateVocabulary
} from '../AsyncActions';
import Constants from '../../util/Constants';
import Ajax from '../../util/Ajax';
import thunk from 'redux-thunk';
import {Action} from 'redux';
import Routing from '../../util/Routing';
import Vocabulary, {CONTEXT as VOCABULARY_CONTEXT} from "../../model/Vocabulary";
import Vocabulary2 from "../../util/VocabularyUtils";
import Routes from '../../util/Routes';
import ActionType, {AsyncAction, AsyncActionSuccess, MessageAction,} from "../ActionType";
import Term, {CONTEXT as TERM_CONTEXT} from "../../model/Term";
import SearchResult from "../../model/SearchResult";
import {ErrorData} from "../../model/ErrorInfo";
import Generator from "../../__tests__/environment/Generator";
import {ThunkDispatch} from "../../util/Types";
import FetchOptionsFunction from "../../model/Functions";

jest.mock('../../util/Routing');
jest.mock('../../util/Ajax', () => ({
    default: jest.fn(),
    content: require.requireActual('../../util/Ajax').content,
    params: require.requireActual('../../util/Ajax').params,
    param: require.requireActual('../../util/Ajax').param,
    accept: require.requireActual('../../util/Ajax').accept,
}));

const mockStore = configureMockStore([thunk]);

describe('Async actions', () => {

    describe('fetch user', () => {
        it('does not publish error message when status is 401', () => {
            const error: ErrorData = {
                message: 'Unauthorized',
                status: Constants.STATUS_UNAUTHORIZED
            };
            Ajax.get = jest.fn().mockImplementation(() => Promise.reject(error));
            const store = mockStore({});
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadUser())).then(() => {
                const actions: Action[] = store.getActions();
                const found = actions.find(a => a.type === ActionType.PUBLISH_MESSAGE);
                return expect(found).not.toBeDefined();
            });
        });
    });

    describe('login', () => {
        it('transitions to home on login success', () => {
            const resp = {
                data: {
                    loggedIn: true
                },
                headers: {}
            };
            resp.headers[Constants.AUTHORIZATION_HEADER] = 'Bearer jwt12345';
            Ajax.post = jest.fn().mockImplementation(() => Promise.resolve(resp));
            const store = mockStore({});
            return Promise.resolve((store.dispatch as ThunkDispatch)(login('test', 'test'))).then(() => {
                expect(Routing.transitionToHome).toHaveBeenCalled();
            });
        });
    });

    describe('create vocabulary', () => {
        it('adds context definition to vocabulary data and sends it over network', () => {
            const vocabulary = new Vocabulary({
                label: 'Test',
                iri: 'http://test'
            });
            const mock = jest.fn().mockImplementation(() => Promise.resolve());
            Ajax.post = mock;
            const store = mockStore({});
            return Promise.resolve((store.dispatch as ThunkDispatch)(createVocabulary(vocabulary))).then(() => {
                expect(Ajax.post).toHaveBeenCalled();
                const config = mock.mock.calls[0][1];
                expect(config.getContentType()).toEqual(Constants.JSON_LD_MIME_TYPE);
                const data = config.getContent();
                expect(data['@context']).toBeDefined();
                expect(data['@context']).toEqual(VOCABULARY_CONTEXT);
            });
        });

        it('transitions to vocabulary detail on success', () => {
            const vocabulary = new Vocabulary({
                label: 'Test',
                iri: 'http://kbss.felk.cvut.cz/termit/rest/vocabularies/test'
            });
            Ajax.post = jest.fn().mockImplementation(() => Promise.resolve({headers: {location: vocabulary.iri}}));
            const store = mockStore({});
            return Promise.resolve((store.dispatch as ThunkDispatch)(createVocabulary(vocabulary))).then(() => {
                expect(Routing.transitionTo).toHaveBeenCalled();
                const args = (Routing.transitionTo as jest.Mock).mock.calls[0];
                expect(args[0]).toEqual(Routes.vocabularyDetail);
                expect(args[1]).toEqual({
                    params: new Map([['name', 'test']]),
                    query: new Map()
                });
            });
        });
    });

    describe('load vocabulary', () => {
        it('extracts vocabulary data from incoming JSON-LD', () => {
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(require('../../rest-mock/vocabulary')));
            const store = mockStore({});
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadVocabulary({fragment: 'metropolitan-plan'}))).then(() => {
                const loadSuccessAction: AsyncActionSuccess<Vocabulary> = store.getActions()[1];
                expect(Vocabulary2.create(loadSuccessAction.payload.iri).fragment === 'metropolitan-plan').toBeTruthy();
            });
        });
    });

    describe('load vocabularies', () => {
        it('extracts vocabularies from incoming JSON-LD', () => {
            const vocabularies = require('../../rest-mock/vocabularies');
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(vocabularies));
            const store = mockStore({});
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadVocabularies())).then(() => {
                const loadSuccessAction: AsyncActionSuccess<Vocabulary[]> = store.getActions()[1];
                const result = loadSuccessAction.payload;
                expect(result.length).toEqual(vocabularies.length);
                result.sort((a, b) => a.iri.localeCompare(b.iri));
                vocabularies.sort((a: object, b: object) => a['@id'].localeCompare(b['@id']));
                for (let i = 0; i < vocabularies.length; i++) {
                    expect(result[i].iri).toEqual(vocabularies[i]['@id']);
                }
            });
        });

        it('extracts single vocabulary as an array of vocabularies from incoming JSON-LD', () => {
            const vocabularies = require('../../rest-mock/vocabularies');
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve([vocabularies[0]]));
            const store = mockStore({});
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadVocabularies())).then(() => {
                const loadSuccessAction: AsyncActionSuccess<Vocabulary[]> = store.getActions()[1];
                const result = loadSuccessAction.payload;
                expect(Array.isArray(result)).toBeTruthy();
                expect(result.length).toEqual(1);
                expect(result[0].iri).toEqual(vocabularies[0]['@id']);
            });
        });
    });

    describe('search', () => {
        it('emits search request action with ignore loading switch', () => {
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve([]));
            const store = mockStore({});
            return Promise.resolve((store.dispatch as ThunkDispatch)(search('test', true))).then(() => {
                const searchRequestAction: AsyncAction = store.getActions()[0];
                expect(searchRequestAction.ignoreLoading).toBeTruthy();
            });
        });

        it('compacts incoming JSON-LD data using SearchResult context', () => {
            const results = require('../../rest-mock/searchResults');
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(results));
            const store = mockStore({});
            return Promise.resolve((store.dispatch as ThunkDispatch)(search('test', true))).then((result: SearchResult[]) => {
                expect(Array.isArray(result)).toBeTruthy();
                result.forEach(r => {
                    expect(r.iri).toBeDefined();
                    expect(r.label).toBeDefined();
                    if (r.hasType(Vocabulary2.TERM)) {
                        expect(r.vocabularyIri).toBeDefined();
                    }
                })
            });
        });
    });

    describe('create term', () => {
        it('create top level term in vocabulary context and send it over the network', () => {
            const term = new Term(
                {
                    label: 'Test term 1',
                    iri: 'http://onto.fel.cvut.cz/ontologies/termit/vocabulary/test-vocabulary/term/test-term-1'
                },
            );
            const mock = jest.fn().mockImplementation(() => Promise.resolve());
            Ajax.post = mock;
            const store = mockStore({});
            return Promise.resolve((store.dispatch as ThunkDispatch)(createVocabularyTerm(term, 'test-vocabulary'))).then(() => {
                expect(Ajax.post).toHaveBeenCalled();
                const config = mock.mock.calls[0][1];
                expect(config.getContentType()).toEqual(Constants.JSON_LD_MIME_TYPE);
                const data = config.getContent();
                expect(data['@context']).toBeDefined();
                expect(data['@context']).toEqual(TERM_CONTEXT);
            });
        });
        it('create child term in vocabulary context and send it over the network', () => {
            const parentTerm = new Term(
                {
                    label: 'Test term 1',
                    iri: 'http://onto.fel.cvut.cz/ontologies/termit/vocabulary/test-vocabulary/term/test-term-1'
                },
            );
            const childTerm = new Term(
                {
                    label: 'Test term 2',
                    iri: 'http://onto.fel.cvut.cz/ontologies/termit/vocabulary/test-vocabulary/term/test-term-2',
                    parent: parentTerm.iri
                },
            );
            const mock = jest.fn().mockImplementation(() => Promise.resolve());
            Ajax.post = mock;
            const store = mockStore({});
            return Promise.resolve((store.dispatch as ThunkDispatch)(createVocabularyTerm(childTerm, 'test-vocabulary'))).then(() => {
                expect(Ajax.post).toHaveBeenCalled();
                const config = mock.mock.calls[0][1];
                expect(config.getContentType()).toEqual(Constants.JSON_LD_MIME_TYPE);
                const data = config.getContent();
                expect(data['@context']).toBeDefined();
                expect(data['@context']).toEqual(TERM_CONTEXT);
            });
        });
    });

    describe('fetch terms', () => {
        it('extracts terms from incoming JSON-LD', () => {
            const terms = require('../../rest-mock/terms');
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(terms));
            const store = mockStore({});
            return Promise.resolve((store.dispatch as ThunkDispatch)(fetchVocabularyTerms({
                searchString: "",
                limit: 5,
                offset: 0,
                optionID: ""
            }, 'test-vocabulary')))
                .then((data: Term[]) => {
                    expect(data.length).toEqual(terms.length);
                    data.sort((a, b) => a.iri.localeCompare(b.iri));
                    terms.sort((a: object, b: object) => a['@id'].localeCompare(b['@id']));
                    for (let i = 0; i < terms.length; i++) {
                        expect(data[i].iri).toEqual(terms[i]['@id']);
                    }
                });
        });

        it('provides parameters with request', () => {
            const terms = require('../../rest-mock/terms');
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(terms));
            const store = mockStore({});
            const params: FetchOptionsFunction = {
                searchString: 'test'
            };
            return Promise.resolve((store.dispatch as ThunkDispatch)(fetchVocabularyTerms(params, 'test-vocabulary'))).then(() => {
                const callConfig = (Ajax.get as jest.Mock).mock.calls[0][1];
                expect(callConfig.getParams()).toEqual(params);
            });
        });

        it('gets all terms when parent option is not specified', () => {
            const terms = require('../../rest-mock/terms');
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(terms));
            const store = mockStore({});
            const vocabName = 'test-vocabulary';
            return Promise.resolve((store.dispatch as ThunkDispatch)(fetchVocabularyTerms({}, vocabName))).then(() => {
                const targetUri = (Ajax.get as jest.Mock).mock.calls[0][0];
                expect(targetUri).toEqual(Constants.API_PREFIX + '/vocabularies/' + vocabName + '/terms');
                const callConfig = (Ajax.get as jest.Mock).mock.calls[0][1];
                expect(callConfig.getParams()).toEqual({});
            });
        });

        it('gets subterms when parent option is specified', () => {
            const terms = require('../../rest-mock/terms');
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(terms));
            const parentUri = 'http://data.iprpraha.cz/zdroj/slovnik/test-vocabulary/term/pojem-3';
            const store = mockStore({});
            const params: FetchOptionsFunction = {
                optionID: parentUri
            };
            const vocabName = 'test-vocabulary';
            return Promise.resolve((store.dispatch as ThunkDispatch)(fetchVocabularyTerms(params, vocabName))).then(() => {
                const targetUri = (Ajax.get as jest.Mock).mock.calls[0][0];
                expect(targetUri).toEqual(Constants.API_PREFIX + '/vocabularies/' + vocabName + '/terms/pojem-3/subterms');
                const callConfig = (Ajax.get as jest.Mock).mock.calls[0][1];
                expect(callConfig.getParams()).toEqual({});
            });
        });
    });
    describe('load types', () => {
        it('loads types from the incoming JSON-LD', () => {
            const types = require('../../rest-mock/types');
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(types));
            const store = mockStore({});
            return Promise.resolve((store.dispatch as ThunkDispatch)(
                loadTypes("en")))
                .then(() => {
                    const loadSuccessAction: AsyncActionSuccess<Vocabulary[]> = store.getActions()[1];
                    const data = loadSuccessAction.payload;
                    expect(data.length).toEqual(types.length);
                    data.sort((a, b) => a.iri.localeCompare(b.iri));
                    types.sort((a: object, b: object) => a['@id'].localeCompare(b['@id']));
                    for (let i = 0; i < types.length; i++) {
                        expect(data[i].iri).toEqual(types[i]['@id']);
                    }
                });
        });
    });
    describe('update term', () => {
        it('sends put request to correct endpoint using vocabulary and term IRI', () => {
            const namespace = 'http://onto.fel.cvut.cz/ontologies/termit/vocabularies/';
            const normalizedVocabularyName = 'test-vocabulary';
            const normalizedTermName = 'test-term';
            const term: Term = new Term({
                iri: namespace + 'pojem/' + normalizedTermName,
                label: 'Test',
                comment: 'Test term'
            });
            const vocabulary = new Vocabulary({
                iri: namespace + normalizedVocabularyName,
                label: 'Test vocabulary'
            });
            const mock = jest.fn().mockImplementation(() => Promise.resolve());
            Ajax.put = mock;
            const store = mockStore({});
            return Promise.resolve((store.dispatch as ThunkDispatch)(updateTerm(term, vocabulary))).then(() => {
                expect(Ajax.put).toHaveBeenCalled();
                const requestUri = mock.mock.calls[0][0];
                expect(requestUri).toEqual(Constants.API_PREFIX + '/vocabularies/' + normalizedVocabularyName + '/terms/' + normalizedTermName);
                const params = mock.mock.calls[0][1].getParams();
                expect(params.namespace).toBeDefined();
                expect(params.namespace).toEqual(namespace);
            });
        });

        it('sends JSON-LD of term argument to REST endpoint', () => {
            const term: Term = new Term({
                iri: Generator.generateUri(),
                label: 'Test',
                comment: 'Test term'
            });
            const vocabulary = new Vocabulary({
                iri: Generator.generateUri(),
                label: 'Test vocabulary'
            });
            const mock = jest.fn().mockImplementation(() => Promise.resolve());
            Ajax.put = mock;
            const store = mockStore({});
            return Promise.resolve((store.dispatch as ThunkDispatch)(updateTerm(term, vocabulary))).then(() => {
                expect(Ajax.put).toHaveBeenCalled();
                const data = mock.mock.calls[0][1].getContent();
                expect(data).toEqual(term.toJsonLd());
            });
        });
    });

    describe('update vocabulary', () => {
        it('sends put request to correct endpoint using vocabulary IRI', () => {
            const namespace = 'http://onto.fel.cvut.cz/ontologies/termit/vocabularies/';
            const normalizedVocabularyName = 'test-vocabulary';
            const vocabulary = new Vocabulary({
                iri: namespace + normalizedVocabularyName,
                label: 'Test vocabulary'
            });
            const mock = jest.fn().mockImplementation(() => Promise.resolve());
            Ajax.put = mock;
            const store = mockStore({});
            return Promise.resolve((store.dispatch as ThunkDispatch)(updateVocabulary(vocabulary))).then(() => {
                expect(Ajax.put).toHaveBeenCalled();
                const requestUri = mock.mock.calls[0][0];
                expect(requestUri).toEqual(Constants.API_PREFIX + '/vocabularies/' + normalizedVocabularyName);
                const params = mock.mock.calls[0][1].getParams();
                expect(params.namespace).toBeDefined();
                expect(params.namespace).toEqual(namespace);
            });
        });

        it('sends JSON-LD of vocabulary argument to REST endpoint', () => {
            const vocabulary = new Vocabulary({
                iri: Generator.generateUri(),
                label: 'Test vocabulary'
            });
            const mock = jest.fn().mockImplementation(() => Promise.resolve());
            Ajax.put = mock;
            const store = mockStore({});
            return Promise.resolve((store.dispatch as ThunkDispatch)(updateVocabulary(vocabulary))).then(() => {
                expect(Ajax.put).toHaveBeenCalled();
                const data = mock.mock.calls[0][1].getContent();
                expect(data).toEqual(vocabulary.toJsonLd());
            });
        });

        it('reloads vocabulary on successful update', () => {
            const vocabulary = new Vocabulary({
                iri: Generator.generateUri(),
                label: 'Test vocabulary'
            });
            Ajax.put = jest.fn().mockImplementation(() => Promise.resolve());
            const store = mockStore({});
            return Promise.resolve((store.dispatch as ThunkDispatch)(updateVocabulary(vocabulary))).then(() => {
                // 0 - async request, 1 - async success, 2 - load vocabulary
                const action: AsyncAction = store.getActions()[2];
                expect(action).toBeDefined();
                expect(action.type).toEqual(ActionType.LOAD_VOCABULARY);
            });
        });

        it('dispatches success message on successful update', () => {
            const vocabulary = new Vocabulary({
                iri: Generator.generateUri(),
                label: 'Test vocabulary'
            });
            Ajax.put = jest.fn().mockImplementation(() => Promise.resolve());
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve());
            const store = mockStore({});
            return Promise.resolve((store.dispatch as ThunkDispatch)(updateVocabulary(vocabulary))).then(() => {
                // 0 - async request, 1 - async success, 2 - load vocabulary, 3 - publish message
                const action: MessageAction = store.getActions()[3];
                expect(action).toBeDefined();
                expect(action.message.messageId).toEqual('vocabulary.updated.message');
            });
        });
    });

    describe('load vocabulary term', () => {
        it('loads vocabulary term using term and vocabulary normalized names on call', () => {
            const vocabName = 'test-vocabulary';
            const termName = 'test-term';
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(require('../../rest-mock/terms')[0]));
            const store = mockStore({});
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadVocabularyTerm(termName, vocabName))).then(() => {
                const url = (Ajax.get as jest.Mock).mock.calls[0][0];
                expect(url).toEqual(Constants.API_PREFIX + '/vocabularies/' + vocabName + '/terms/' + termName);
            });
        });

        it('passes namespace parameter when it is specified on action call', () => {
            const vocabName = 'test-vocabulary';
            const termName = 'test-term';
            const namespace = 'http://onto.fel.cvut.cz/ontologies/termit/vocabularies/';
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(require('../../rest-mock/terms')[0]));
            const store = mockStore({});
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadVocabularyTerm(termName, vocabName, namespace))).then(() => {
                const url = (Ajax.get as jest.Mock).mock.calls[0][0];
                expect(url).toEqual(Constants.API_PREFIX + '/vocabularies/' + vocabName + '/terms/' + termName);
                const config = (Ajax.get as jest.Mock).mock.calls[0][1];
                expect(config).toBeDefined();
                expect(config.getParams().namespace).toEqual(namespace);
            });
        });
    });
});
