import configureMockStore from 'redux-mock-store';
import {createVocabulary, loadVocabularies, loadVocabulary, login} from '../AsyncActions';
import Constants from '../../util/Constants';
import Ajax from '../../util/Ajax';
import thunk, {ThunkDispatch} from 'redux-thunk';
import {Action} from 'redux';
import Routing from '../../util/Routing';
import Authentication from '../../util/Authentication';
import Vocabulary, {CONTEXT} from "../../model/Vocabulary";
import Routes from '../../util/Routes';
import {VocabulariesLoadingAction, VocabularyLoadingAction} from "../ActionType";

jest.mock('../../util/Routing');
jest.mock('../../util/Ajax', () => ({
    default: jest.fn(),
    content: require.requireActual('../../util/Ajax').content,
    params: require.requireActual('../../util/Ajax').params,
    accept: require.requireActual('../../util/Ajax').accept,
}));
jest.mock('../../util/Authentication');

const mockStore = configureMockStore([thunk]);

describe('Async actions', () => {

    describe('login', () => {

        it('saves JWT on login success', () => {
            const resp = {
                data: {
                    loggedIn: true
                },
                headers: {}
            };
            const jwt = 'Bearer jwt12345';
            resp.headers[Constants.AUTHENTICATION_HEADER] = jwt;
            Ajax.post = jest.fn().mockImplementation(() => Promise.resolve(resp));
            Authentication.saveToken = jest.fn();
            const store = mockStore({});
            return Promise.resolve((store.dispatch as ThunkDispatch<object, undefined, Action>)(login('test', 'test'))).then(() => {
                expect(Authentication.saveToken).toHaveBeenCalledWith(jwt);
            });
        });

        it('transitions to home on login success', () => {
            const resp = {
                data: {
                    loggedIn: true
                },
                headers: {}
            };
            resp.headers[Constants.AUTHENTICATION_HEADER] = 'Bearer jwt12345';
            Ajax.post = jest.fn().mockImplementation(() => Promise.resolve(resp));
            const store = mockStore({});
            return Promise.resolve((store.dispatch as ThunkDispatch<object, undefined, Action>)(login('test', 'test'))).then(() => {
                expect(Routing.transitionToHome).toHaveBeenCalled();
            });
        });
    });

    describe('create vocabulary', () => {
        it('adds context definition to vocabulary data and sends it over network', () => {
            const vocabulary = new Vocabulary({
                name: 'Test',
                iri: 'http://test'
            });
            const mock = jest.fn().mockImplementation(() => Promise.resolve());
            Ajax.post = mock;
            const store = mockStore({});
            return Promise.resolve((store.dispatch as ThunkDispatch<object, undefined, Action>)(createVocabulary(vocabulary))).then(() => {
                expect(Ajax.post).toHaveBeenCalled();
                const config = mock.mock.calls[0][1];
                expect(config.getContentType()).toEqual(Constants.JSON_LD_MIME_TYPE);
                const data = config.getContent();
                expect(data['@context']).toBeDefined();
                expect(data['@context']).toEqual(CONTEXT);
            });
        });

        it('transitions to vocabulary detail on success', () => {
            const vocabulary = new Vocabulary({
                name: 'Test',
                iri: 'http://kbss.felk.cvut.cz/termit/rest/vocabularies/test'
            });
            Ajax.post = jest.fn().mockImplementation(() => Promise.resolve({headers: {location: vocabulary.iri}}));
            const store = mockStore({});
            return Promise.resolve((store.dispatch as ThunkDispatch<object, undefined, Action>)(createVocabulary(vocabulary))).then(() => {
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
            return Promise.resolve((store.dispatch as ThunkDispatch<object, undefined, Action>)(loadVocabulary('metropolitan-plan'))).then(() => {
                const loadSuccessAction: VocabularyLoadingAction = store.getActions()[1];
                expect(loadSuccessAction.vocabulary.name).toEqual('Metropolitan plan');
            });
        });
    });

    describe('load vocabularies', () => {
        it('extracts vocabularies from incoming JSON-LD', () => {
            const vocabularies = require('../../rest-mock/vocabularies');
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(vocabularies));
            const store = mockStore({});
            return Promise.resolve((store.dispatch as ThunkDispatch<object, undefined, Action>)(loadVocabularies())).then(() => {
                const loadSuccessAction: VocabulariesLoadingAction = store.getActions()[1];
                const result = loadSuccessAction.vocabularies;
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
            return Promise.resolve((store.dispatch as ThunkDispatch<object, undefined, Action>)(loadVocabularies())).then(() => {
                const loadSuccessAction: VocabulariesLoadingAction = store.getActions()[1];
                const result = loadSuccessAction.vocabularies;
                expect(Array.isArray(result)).toBeTruthy();
                expect(result.length).toEqual(1);
                expect(result[0].iri).toEqual(vocabularies[0]['@id']);
            });
        });
    });
});
