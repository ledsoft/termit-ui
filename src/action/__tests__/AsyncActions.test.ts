import configureMockStore, {MockStoreEnhanced} from "redux-mock-store";
import {
    createFileInDocument,
    createProperty,
    createResource,
    createTerm,
    createVocabulary,
    executeFileTextAnalysis, exportFileContent,
    exportGlossary,
    getLabel,
    getProperties,
    hasFileContent,
    loadFileContent, loadImportedVocabularies,
    loadLastEditedAssets,
    loadLatestTextAnalysisRecord, loadResource,
    loadResources,
    loadResourceTermAssignmentsInfo,
    loadTerm,
    loadTermAssignmentsInfo,
    loadTerms,
    loadTypes,
    loadUser,
    loadVocabularies,
    loadVocabulary,
    login,
    register,
    removeResource,
    updateResourceTerms,
    updateTerm,
    updateVocabulary,
    uploadFileContent
} from "../AsyncActions";
import Constants from "../../util/Constants";
import Ajax, {param} from "../../util/Ajax";
import thunk from "redux-thunk";
import {Action} from "redux";
import Routing from "../../util/Routing";
import Vocabulary, {CONTEXT as VOCABULARY_CONTEXT} from "../../model/Vocabulary";
import Vocabulary2 from "../../util/VocabularyUtils";
import VocabularyUtils from "../../util/VocabularyUtils";
import Routes from "../../util/Routes";
import ActionType, {AsyncAction, AsyncActionSuccess, AsyncFailureAction, MessageAction,} from "../ActionType";
import Term, {CONTEXT as TERM_CONTEXT} from "../../model/Term";
import {ErrorData} from "../../model/ErrorInfo";
import Generator from "../../__tests__/environment/Generator";
import {ThunkDispatch} from "../../util/Types";
import FetchOptionsFunction from "../../model/Functions";
import RdfsResource, {CONTEXT as RDFS_RESOURCE_CONTEXT} from "../../model/RdfsResource";
import TermItState from "../../model/TermItState";
import Resource, {CONTEXT as RESOURCE_CONTEXT} from "../../model/Resource";
import Utils from "../../util/Utils";
import AsyncActionStatus from "../AsyncActionStatus";
import ExportType from "../../util/ExportType";
import fileContent from "../../rest-mock/file";
import Asset from "../../model/Asset";
import TermItFile from "../../model/File";
import {UserAccountData} from "../../model/User";
import MessageType from "../../model/MessageType";
import {CONTEXT as TA_RECORD_CONTEXT, TextAnalysisRecord} from "../../model/TextAnalysisRecord";
import {
    CONTEXT as RESOURCE_TERM_ASSIGNMENT_CONTEXT,
    ResourceTermAssignments
} from "../../model/ResourceTermAssignments";
import {CONTEXT as TERM_ASSIGNMENTS_CONTEXT, TermAssignments} from "../../model/TermAssignments";

jest.mock("../../util/Routing");
jest.mock("../../util/Ajax", () => ({
    default: jest.fn(),
    content: require.requireActual("../../util/Ajax").content,
    params: require.requireActual("../../util/Ajax").params,
    param: require.requireActual("../../util/Ajax").param,
    accept: require.requireActual("../../util/Ajax").accept,
    contentType: require.requireActual("../../util/Ajax").contentType,
    formData: require.requireActual("../../util/Ajax").formData
}));

const mockStore = configureMockStore<TermItState>([thunk]);

describe("Async actions", () => {

    let store: MockStoreEnhanced<TermItState>;

    beforeEach(() => {
        jest.clearAllMocks();
        store = mockStore(new TermItState());
    });

    describe("fetch user", () => {
        it("does not publish error message when status is 401", () => {
            const error: ErrorData = {
                message: "Unauthorized",
                status: Constants.STATUS_UNAUTHORIZED
            };
            Ajax.get = jest.fn().mockImplementation(() => Promise.reject(error));
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadUser())).then(() => {
                const actions: Action[] = store.getActions();
                const found = actions.find(a => a.type === ActionType.PUBLISH_MESSAGE);
                return expect(found).not.toBeDefined();
            });
        });
    });

    describe("login", () => {
        it("transitions to home on login success", () => {
            const resp = {
                data: {
                    loggedIn: true
                },
                headers: {}
            };
            resp.headers[Constants.AUTHORIZATION_HEADER] = "Bearer jwt12345";
            Ajax.post = jest.fn().mockImplementation(() => Promise.resolve(resp));
            return Promise.resolve((store.dispatch as ThunkDispatch)(login("test", "test"))).then(() => {
                expect(Routing.transitionToHome).toHaveBeenCalled();
            });
        });
    });

    describe("register", () => {

        const userInfo: UserAccountData = {
            firstName: "test",
            lastName: "testowitch",
            username: "admin",
            password: "iamtheboss"
        };

        it("invokes login on registration success", () => {
            Ajax.post = jest.fn().mockImplementation(() => Promise.resolve());
            return Promise.resolve((store.dispatch as ThunkDispatch)(register(userInfo))).then(() => {
                expect(store.getActions().find(a => a.type === ActionType.LOGIN)).toBeDefined();
            });
        });

        it("returns error info on error", () => {
            const message = "User already exists";
            Ajax.post = jest.fn().mockImplementation(() => Promise.reject({
                status: 409,
                message
            }));
            return Promise.resolve((store.dispatch as ThunkDispatch)(register(userInfo))).then(result => {
                expect(result.type).toEqual(ActionType.REGISTER);
                expect((result as AsyncFailureAction).error).toBeDefined();
                expect((result as AsyncFailureAction).error.message).toEqual(message);
            });
        });
    });

    describe("create vocabulary", () => {
        it("adds context definition to vocabulary data and sends it over network", () => {
            const vocabulary = new Vocabulary({
                label: "Test",
                iri: "http://test"
            });
            const mock = jest.fn().mockImplementation(() => Promise.resolve());
            Ajax.post = mock;
            return Promise.resolve((store.dispatch as ThunkDispatch)(createVocabulary(vocabulary))).then(() => {
                expect(Ajax.post).toHaveBeenCalled();
                const config = mock.mock.calls[0][1];
                expect(config.getContentType()).toEqual(Constants.JSON_LD_MIME_TYPE);
                const data = config.getContent();
                expect(data["@context"]).toBeDefined();
                expect(data["@context"]).toEqual(VOCABULARY_CONTEXT);
            });
        });

        it("transitions to vocabulary summary on success", () => {
            const vocabulary = new Vocabulary({
                label: "Test",
                iri: "http://kbss.felk.cvut.cz/termit/rest/vocabularies/test"
            });
            Ajax.post = jest.fn().mockImplementation(() => Promise.resolve({headers: {location: vocabulary.iri}}));
            return Promise.resolve((store.dispatch as ThunkDispatch)(createVocabulary(vocabulary))).then(() => {
                expect(Routing.transitionTo).toHaveBeenCalled();
                const args = (Routing.transitionTo as jest.Mock).mock.calls[0];
                expect(args[0]).toEqual(Routes.vocabularySummary);
                expect(args[1]).toEqual({
                    params: new Map([["name", "test"]]),
                    query: new Map()
                });
            });
        });

        it("reloads vocabularies on success", () => {
            const vocabulary = new Vocabulary({
                label: "Test",
                iri: "http://kbss.felk.cvut.cz/termit/rest/vocabularies/test"
            });
            Ajax.post = jest.fn().mockImplementation(() => Promise.resolve({headers: {location: vocabulary.iri}}));
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve([]));
            return Promise.resolve((store.dispatch as ThunkDispatch)(createVocabulary(vocabulary))).then(() => {
                const actions = store.getActions();
                expect(actions.find(a => a.type === ActionType.LOAD_VOCABULARIES)).toBeDefined();
            });
        });
    });

    describe("load vocabulary", () => {
        it("extracts vocabulary data from incoming JSON-LD", () => {
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(require("../../rest-mock/vocabulary")));
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadVocabulary({fragment: "metropolitan-plan"}))).then(() => {
                const loadSuccessAction: AsyncActionSuccess<Vocabulary> = store.getActions().find(a => a.type === ActionType.LOAD_VOCABULARY && a.status === AsyncActionStatus.SUCCESS);
                expect(loadSuccessAction).toBeDefined();
                expect(Vocabulary2.create(loadSuccessAction.payload.iri).fragment === "metropolitan-plan").toBeTruthy();
            });
        });

        it("does nothing when vocabulary loading action is already pending", () => {
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(require("../../rest-mock/vocabulary")));

            store.getState().pendingActions[ActionType.LOAD_VOCABULARY] = AsyncActionStatus.REQUEST;
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadVocabulary({fragment: "metropolitan-plan"}))).then(() => {
                expect(Ajax.get).not.toHaveBeenCalled();
            });
        });

        it("dispatches vocabulary imports loading on success", () => {
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(require("../../rest-mock/vocabulary")));
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadVocabulary({fragment: "metropolitan-plan"}))).then(() => {
                const loadImportsAction = store.getActions().find(a => a.type === ActionType.LOAD_VOCABULARY_IMPORTS);
                expect(loadImportsAction).toBeDefined();
            });
        });

        it("passes loaded vocabulary imports to store", () => {
            const imports = [Generator.generateUri(), Generator.generateUri()];
            Ajax.get = jest.fn().mockImplementation((url) => {
                if (url.endsWith("/imports")) {
                    return Promise.resolve(imports);
                } else {
                    return Promise.resolve(require("../../rest-mock/vocabulary"));
                }
            });
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadVocabulary({fragment: "metropolitan-plan"}))).then(() => {
                const loadImportsSuccessAction = store.getActions().find(a => a.type === ActionType.LOAD_VOCABULARY_IMPORTS && a.status === AsyncActionStatus.SUCCESS);
                expect(loadImportsSuccessAction).toBeDefined();
                expect(loadImportsSuccessAction.payload).toEqual(imports);
            });
        });
    });

    describe("load vocabularies", () => {
        it("extracts vocabularies from incoming JSON-LD", () => {
            const vocabularies = require("../../rest-mock/vocabularies");
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(vocabularies));
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadVocabularies())).then(() => {
                const loadSuccessAction: AsyncActionSuccess<Vocabulary[]> = store.getActions()[1];
                const result = loadSuccessAction.payload;
                expect(result.length).toEqual(vocabularies.length);
                result.sort((a, b) => a.iri.localeCompare(b.iri));
                vocabularies.sort((a: object, b: object) => a["@id"].localeCompare(b["@id"]));
                for (let i = 0; i < vocabularies.length; i++) {
                    expect(result[i].iri).toEqual(vocabularies[i]["@id"]);
                }
            });
        });

        it("extracts single vocabulary as an array of vocabularies from incoming JSON-LD", () => {
            const vocabularies = require("../../rest-mock/vocabularies");
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve([vocabularies[0]]));
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadVocabularies())).then(() => {
                const loadSuccessAction: AsyncActionSuccess<Vocabulary[]> = store.getActions()[1];
                const result = loadSuccessAction.payload;
                expect(Array.isArray(result)).toBeTruthy();
                expect(result.length).toEqual(1);
                expect(result[0].iri).toEqual(vocabularies[0]["@id"]);
            });
        });

        it("does nothing when vocabularies loading action is already pending", () => {
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve([]));

            store.getState().pendingActions[ActionType.LOAD_VOCABULARIES] = AsyncActionStatus.REQUEST;
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadVocabularies())).then(() => {
                expect(Ajax.get).not.toHaveBeenCalled();
            });
        });
    });

    describe("load file content", () => {
        it("extracts file content from incoming html data", () => {
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(fileContent));
            return Promise.resolve(
                (store.dispatch as ThunkDispatch)
                (loadFileContent({fragment: "metropolitan-plan"}))
            ).then(() => {
                const loadSuccessAction: AsyncActionSuccess<string> = store.getActions()[1];
                expect(loadSuccessAction.payload).toContain("html");
            });
        });

        it("does nothing when file content loading action is already pending", () => {
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve([]));

            store.getState().pendingActions[ActionType.LOAD_FILE_CONTENT] = AsyncActionStatus.REQUEST;
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadFileContent({fragment: "metropolitan-plan"}))).then(() => {
                expect(Ajax.get).not.toHaveBeenCalled();
            });
        });
    });

    describe("create term", () => {

        const vocabularyIri = VocabularyUtils.create("http://onto.fel.cvut.cz/ontologies/termit/vocabulary/test-vocabulary");

        it("create top level term in vocabulary context and send it over the network", () => {
            const term = new Term({
                label: "Test term 1",
                iri: vocabularyIri.toString() + "term/test-term-1"
            });
            const mock = jest.fn().mockImplementation(() => Promise.resolve());
            Ajax.post = mock;
            return Promise.resolve((store.dispatch as ThunkDispatch)(createTerm(term, vocabularyIri))).then(() => {
                expect(Ajax.post).toHaveBeenCalled();
                expect(mock.mock.calls[0][0]).toEqual(Constants.API_PREFIX + "/vocabularies/" + vocabularyIri.fragment + "/terms");
                const config = mock.mock.calls[0][1];
                expect(config.getContentType()).toEqual(Constants.JSON_LD_MIME_TYPE);
                const data = config.getContent();
                expect(data["@context"]).toBeDefined();
                expect(data["@context"]).toEqual(TERM_CONTEXT);
            });
        });

        it("create child term in vocabulary context and send it over the network", () => {
            const parentFragment = "test-term-1";
            const parentTerm = new Term({
                label: "Test term 1",
                iri: vocabularyIri.toString() + "term/" + parentFragment,
                vocabulary: {iri: vocabularyIri.toString()}
            });
            const childTerm = new Term({
                label: "Test term 2",
                iri: vocabularyIri.toString() + "term/test-term-2",
                parentTerms: [parentTerm]
            });
            const mock = jest.fn().mockImplementation(() => Promise.resolve());
            Ajax.post = mock;
            return Promise.resolve((store.dispatch as ThunkDispatch)(createTerm(childTerm, vocabularyIri))).then(() => {
                expect(Ajax.post).toHaveBeenCalled();
                expect(mock.mock.calls[0][0]).toEqual(Constants.API_PREFIX + "/vocabularies/" + vocabularyIri.fragment + "/terms/" + parentFragment + "/subterms");
                const config = mock.mock.calls[0][1];
                expect(config.getContentType()).toEqual(Constants.JSON_LD_MIME_TYPE);
                const data = config.getContent();
                expect(data["@context"]).toBeDefined();
                expect(data["@context"]).toEqual(TERM_CONTEXT);
            });
        });

        it("publishes notification on successful creation", () => {
            const term = new Term({
                label: "Test term 1",
                iri: vocabularyIri.toString() + "term/test-term-1"
            });
            Ajax.post = jest.fn().mockImplementation(() => Promise.resolve({
                headers: {
                    "location": "http://test"
                }
            }));
            return Promise.resolve((store.dispatch as ThunkDispatch)(createTerm(term, vocabularyIri))).then(() => {
                const actions = store.getActions();
                const action = actions[actions.length - 1];
                expect(action.type).toEqual(ActionType.PUBLISH_NOTIFICATION);
                expect(action.notification.source.type).toEqual(ActionType.CREATE_VOCABULARY_TERM);
                expect(action.notification.source.status).toEqual(AsyncActionStatus.SUCCESS);
            });
        });

        it("provides vocabulary namespace in a request parameter", () => {
            const term = new Term({
                label: "Test term 1",
                iri: vocabularyIri.toString() + "term/test-term-1"
            });
            const mock = jest.fn().mockImplementation(() => Promise.resolve());
            Ajax.post = mock;
            return Promise.resolve((store.dispatch as ThunkDispatch)(createTerm(term, vocabularyIri))).then(() => {
                const config = mock.mock.calls[0][1];
                expect(config.getParams().namespace).toEqual(vocabularyIri.namespace);
            });
        });

        it("uses parent vocabulary IRI for request URL when new child term is in different vocabulary than parent term", () => {
            const parentVocabularyIri = "http://onto.fel.cvut.cz/ontologies/termit/vocabulary/parent-vocabulary";
            const parentTerm = new Term({
                iri: parentVocabularyIri + "/terms/parent-term",
                label: "Parent term",
                vocabulary: {iri: parentVocabularyIri}
            });
            const childTerm = new Term({
                iri: vocabularyIri.toString() + "/terms/test-term",
                label: "Test term",
                parentTerms: [parentTerm]
            });
            Ajax.post = jest.fn().mockImplementation(() => Promise.resolve());
            return Promise.resolve((store.dispatch as ThunkDispatch)(createTerm(childTerm, vocabularyIri))).then(() => {
                const url = (Ajax.post as jest.Mock).mock.calls[0][0];
                const config = (Ajax.post as jest.Mock).mock.calls[0][1];
                const parentIri = VocabularyUtils.create(parentVocabularyIri);
                expect(url).toContain(parentIri.fragment);
                expect(config.getParams().namespace).toEqual(parentIri.namespace);
            });
        });

        it("sets term vocabulary before sending it to server", () => {
            const term = new Term({
                label: "Test term 1",
                iri: vocabularyIri.toString() + "term/test-term-1"
            });
            Ajax.post = jest.fn().mockImplementation(() => Promise.resolve());
            return Promise.resolve((store.dispatch as ThunkDispatch)(createTerm(term, vocabularyIri))).then(() => {
                const config = (Ajax.post as jest.Mock).mock.calls[0][1];
                const data = config.getContent();
                expect(data.vocabulary).toBeDefined();
                expect(data.vocabulary.iri).toEqual(vocabularyIri.toString());
            });
        });
    });

    describe("execute file text analysis", () => {
        const file = new TermItFile({
            iri: Generator.generateUri(),
            label: "test.html"
        });

        it("publishes message on error", () => {
            Ajax.put = jest.fn().mockImplementation(() => Promise.reject("An error"));
            return Promise.resolve((store.dispatch as ThunkDispatch)(executeFileTextAnalysis(file))).then(() => {
                const actions: Action[] = store.getActions();
                const found = actions.find(a => a.type === ActionType.PUBLISH_MESSAGE);
                expect(found).toBeDefined();
                expect((found as MessageAction).message.type).toBe(MessageType.ERROR);
            });
        });

        it("publishes message on success", () => {
            Ajax.put = jest.fn().mockImplementation(() => Promise.resolve("Success"));
            return Promise.resolve((store.dispatch as ThunkDispatch)(executeFileTextAnalysis(file))).then(() => {
                const actions: Action[] = store.getActions();
                const found = actions.find(a => a.type === ActionType.PUBLISH_MESSAGE);
                expect(found).toBeDefined();
                expect((found as MessageAction).message.type).toBe(MessageType.SUCCESS);
            });
        });
    });

    describe("load terms", () => {
        it("extracts terms from incoming JSON-LD", () => {
            const terms = require("../../rest-mock/terms");
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(terms));
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadTerms({
                searchString: "",
                limit: 5,
                offset: 0,
                optionID: ""
            }, {fragment: "test-vocabulary"})))
                .then((data: Term[]) => {
                    expect(data.length).toEqual(terms.length);
                    data.sort((a, b) => a.iri.localeCompare(b.iri));
                    terms.sort((a: object, b: object) => a["@id"].localeCompare(b["@id"]));
                    for (let i = 0; i < terms.length; i++) {
                        expect(data[i].iri).toEqual(terms[i]["@id"]);
                    }
                });
        });

        it("provides search parameter with request when specified", () => {
            const terms = require("../../rest-mock/terms");
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(terms));
            const params: FetchOptionsFunction = {
                searchString: "test"
            };
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadTerms(params, {fragment: "test-vocabulary"}))).then(() => {
                const callConfig = (Ajax.get as jest.Mock).mock.calls[0][1];
                expect(callConfig.getParams()).toEqual(params);
            });
        });

        it("gets all root terms when parent option is not specified", () => {
            const terms = require("../../rest-mock/terms");
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(terms));
            const vocabName = "test-vocabulary";
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadTerms({}, {fragment: vocabName}))).then(() => {
                const targetUri = (Ajax.get as jest.Mock).mock.calls[0][0];
                expect(targetUri).toEqual(Constants.API_PREFIX + "/vocabularies/" + vocabName + "/terms/roots");
                const callConfig = (Ajax.get as jest.Mock).mock.calls[0][1];
                expect(callConfig.getParams()).toEqual({});
            });
        });

        it("gets subterms when parent option is specified", () => {
            const terms = require("../../rest-mock/terms");
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(terms));
            const parentUri = "http://data.iprpraha.cz/zdroj/slovnik/test-vocabulary/term/pojem-3";
            const params: FetchOptionsFunction = {
                optionID: parentUri
            };
            const vocabName = "test-vocabulary";
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadTerms(params, {fragment: vocabName}))).then(() => {
                const targetUri = (Ajax.get as jest.Mock).mock.calls[0][0];
                expect(targetUri).toEqual(Constants.API_PREFIX + "/vocabularies/" + vocabName + "/terms/pojem-3/subterms");
                const callConfig = (Ajax.get as jest.Mock).mock.calls[0][1];
                expect(callConfig.getParams()).toEqual({});
            });
        });

        it("specifies correct paging params for offset and limit", () => {
            const terms = require("../../rest-mock/terms");
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(terms));
            const params: FetchOptionsFunction = {
                offset: 88,
                limit: 100
            };
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadTerms(params, {fragment: "test-vocabulary"}))).then(() => {
                const callConfig = (Ajax.get as jest.Mock).mock.calls[0][1];
                expect(callConfig.getParams()).toEqual({page: 1, size: 100});
            });
        });

        it("provides includeImported with request when specified", () => {
            const terms = require("../../rest-mock/terms");
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(terms));
            const params: FetchOptionsFunction = {
                includeImported: true
            };
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadTerms(params, {fragment: "test-vocabulary"}))).then(() => {
                const callConfig = (Ajax.get as jest.Mock).mock.calls[0][1];
                expect(callConfig.getParams()).toEqual(params);
            });
        });
    });
    describe("load types", () => {
        it("loads types from the incoming JSON-LD", () => {
            const types = require("../../rest-mock/types");
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(types));
            return Promise.resolve((store.dispatch as ThunkDispatch)(
                loadTypes("en")))
                .then(() => {
                    const loadSuccessAction: AsyncActionSuccess<Vocabulary[]> = store.getActions()[1];
                    const data = loadSuccessAction.payload;
                    expect(data.length).toEqual(types.length);
                    data.sort((a, b) => a.iri.localeCompare(b.iri));
                    types.sort((a: object, b: object) => a["@id"].localeCompare(b["@id"]));
                    for (let i = 0; i < types.length; i++) {
                        expect(data[i].iri).toEqual(types[i]["@id"]);
                    }
                });
        });
    });
    describe("update term", () => {
        it("sends put request to correct endpoint using vocabulary and term IRI", () => {
            const namespace = "http://onto.fel.cvut.cz/ontologies/termit/vocabularies/";
            const normalizedVocabularyName = "test-vocabulary";
            const normalizedTermName = "test-term";
            const term: Term = new Term({
                iri: namespace + "pojem/" + normalizedTermName,
                label: "Test",
                comment: "Test term",
                vocabulary: {iri: namespace + normalizedVocabularyName}
            });
            const mock = jest.fn().mockImplementation(() => Promise.resolve());
            Ajax.put = mock;
            return Promise.resolve((store.dispatch as ThunkDispatch)(updateTerm(term))).then(() => {
                expect(Ajax.put).toHaveBeenCalled();
                const requestUri = mock.mock.calls[0][0];
                expect(requestUri).toEqual(Constants.API_PREFIX + "/vocabularies/" + normalizedVocabularyName + "/terms/" + normalizedTermName);
                const params = mock.mock.calls[0][1].getParams();
                expect(params.namespace).toBeDefined();
                expect(params.namespace).toEqual(namespace);
            });
        });

        it("sends JSON-LD of term argument to REST endpoint", () => {
            const term: Term = new Term({
                iri: Generator.generateUri(),
                label: "Test",
                comment: "Test term",
                vocabulary: {iri: "http://onto.fel.cvut.cz/ontologies/termit/vocabularies/test-vocabulary"}
            });
            const mock = jest.fn().mockImplementation(() => Promise.resolve());
            Ajax.put = mock;
            return Promise.resolve((store.dispatch as ThunkDispatch)(updateTerm(term))).then(() => {
                expect(Ajax.put).toHaveBeenCalled();
                const data = mock.mock.calls[0][1].getContent();
                expect(data).toEqual(term.toJsonLd());
            });
        });
    });

    describe("update vocabulary", () => {
        it("sends put request to correct endpoint using vocabulary IRI", () => {
            const namespace = "http://onto.fel.cvut.cz/ontologies/termit/vocabularies/";
            const normalizedVocabularyName = "test-vocabulary";
            const vocabulary = new Vocabulary({
                iri: namespace + normalizedVocabularyName,
                label: "Test vocabulary"
            });
            const mock = jest.fn().mockImplementation(() => Promise.resolve());
            Ajax.put = mock;
            return Promise.resolve((store.dispatch as ThunkDispatch)(updateVocabulary(vocabulary))).then(() => {
                expect(Ajax.put).toHaveBeenCalled();
                const requestUri = mock.mock.calls[0][0];
                expect(requestUri).toEqual(Constants.API_PREFIX + "/vocabularies/" + normalizedVocabularyName);
                const params = mock.mock.calls[0][1].getParams();
                expect(params.namespace).toBeDefined();
                expect(params.namespace).toEqual(namespace);
            });
        });

        it("sends JSON-LD of vocabulary argument to REST endpoint", () => {
            const vocabulary = new Vocabulary({
                iri: Generator.generateUri(),
                label: "Test vocabulary"
            });
            const mock = jest.fn().mockImplementation(() => Promise.resolve());
            Ajax.put = mock;
            return Promise.resolve((store.dispatch as ThunkDispatch)(updateVocabulary(vocabulary))).then(() => {
                expect(Ajax.put).toHaveBeenCalled();
                const data = mock.mock.calls[0][1].getContent();
                expect(data).toEqual(vocabulary.toJsonLd());
            });
        });

        it("reloads vocabulary on successful update", () => {
            const vocabulary = new Vocabulary({
                iri: Generator.generateUri(),
                label: "Test vocabulary"
            });
            Ajax.put = jest.fn().mockImplementation(() => Promise.resolve());
            return Promise.resolve((store.dispatch as ThunkDispatch)(updateVocabulary(vocabulary))).then(() => {
                // 0 - async request, 1 - async success, 2 - load vocabulary
                const action: AsyncAction = store.getActions()[2];
                expect(action).toBeDefined();
                expect(action.type).toEqual(ActionType.LOAD_VOCABULARY);
            });
        });

        it("dispatches success message on successful update", () => {
            const vocabulary = new Vocabulary({
                iri: Generator.generateUri(),
                label: "Test vocabulary"
            });
            Ajax.put = jest.fn().mockImplementation(() => Promise.resolve());
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve());
            return Promise.resolve((store.dispatch as ThunkDispatch)(updateVocabulary(vocabulary))).then(() => {
                // 0 - async request, 1 - async success, 2 - load vocabulary, 3 - publish message
                const action: MessageAction = store.getActions()[3];
                expect(action).toBeDefined();
                expect(action.message.messageId).toEqual("vocabulary.updated.message");
            });
        });
    });

    describe("load vocabulary term", () => {
        it("loads vocabulary term using term and vocabulary normalized names on call", () => {
            const vocabName = "test-vocabulary";
            const termName = "test-term";
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(require("../../rest-mock/terms")[0]));
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadTerm(termName, {fragment: vocabName}))).then(() => {
                const url = (Ajax.get as jest.Mock).mock.calls[0][0];
                expect(url).toEqual(Constants.API_PREFIX + "/vocabularies/" + vocabName + "/terms/" + termName);
            });
        });

        it("passes namespace parameter when it is specified on action call", () => {
            const vocabName = "test-vocabulary";
            const termName = "test-term";
            const namespace = "http://onto.fel.cvut.cz/ontologies/termit/vocabularies/";
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(require("../../rest-mock/terms")[0]));
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadTerm(termName, {
                fragment: vocabName,
                namespace
            }))).then(() => {
                const url = (Ajax.get as jest.Mock).mock.calls[0][0];
                expect(url).toEqual(Constants.API_PREFIX + "/vocabularies/" + vocabName + "/terms/" + termName);
                const config = (Ajax.get as jest.Mock).mock.calls[0][1];
                expect(config).toBeDefined();
                expect(config.getParams().namespace).toEqual(namespace);
            });
        });
    });

    describe("get label", () => {
        it("sends request with identifier as query param", () => {
            const iri = Generator.generateUri();
            const label = "test";
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(label));
            // const store = mockStore({});
            return Promise.resolve((store.dispatch as ThunkDispatch)(getLabel(iri))).then(() => {
                const url = (Ajax.get as jest.Mock).mock.calls[0][0];
                expect(url).toEqual(Constants.API_PREFIX + "/data/label");
                const config = (Ajax.get as jest.Mock).mock.calls[0][1];
                expect(config).toBeDefined();
                expect(config.getParams().iri).toEqual(iri);
            });
        });

        it("returns retrieved label on success", () => {
            const iri = Generator.generateUri();
            const label = "test";
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(label));
            return Promise.resolve((store.dispatch as ThunkDispatch)(getLabel(iri))).then((result) => {
                expect(result).toEqual(label);
            });
        });

        it("returns undefined if label is not found", () => {
            const iri = Generator.generateUri();
            Ajax.get = jest.fn().mockImplementation(() => Promise.reject({status: 404}));
            return Promise.resolve((store.dispatch as ThunkDispatch)(getLabel(iri))).then((result) => {
                expect(result).not.toBeDefined();
            });
        });

        it("disables loading when sending label request", () => {
            const iri = Generator.generateUri();
            const label = "test";
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(label));
            return Promise.resolve((store.dispatch as ThunkDispatch)(getLabel(iri))).then(() => {
                const action: AsyncAction = store.getActions()[0];
                expect(action.ignoreLoading).toBeTruthy();
            });
        });
    });

    describe("getProperties", () => {
        it("sends request to load properties from server", () => {
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve([]));
            return Promise.resolve((store.dispatch as ThunkDispatch)(getProperties())!).then(() => {
                const url = (Ajax.get as jest.Mock).mock.calls[0][0];
                expect(url).toEqual(Constants.API_PREFIX + "/data/properties");
            });
        });

        it("loads data from response and passes them to store", () => {
            const result = [{
                "@id": "http://www.w3.org/2000/01/rdf-schema#label",
                "http://www.w3.org/2000/01/rdf-schema#label": "Label",
                "http://www.w3.org/2000/01/rdf-schema#comment": "Comment"
            }];
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(result));
            return Promise.resolve((store.dispatch as ThunkDispatch)(getProperties())!).then(() => {
                const action: AsyncActionSuccess<RdfsResource[]> = store.getActions()[1];
                expect(action.payload.length).toEqual(1);
                expect(action.payload[0].iri).toEqual(result[0]["@id"]);
                expect(action.payload[0].label).toEqual(result[0]["http://www.w3.org/2000/01/rdf-schema#label"]);
                expect(action.payload[0].comment).toEqual(result[0]["http://www.w3.org/2000/01/rdf-schema#comment"]);
            });
        });

        it("does not send request if data are already present in store", () => {
            const data = [new RdfsResource({
                iri: "http://www.w3.org/2000/01/rdf-schema#label",
                label: "Label",
                comment: "Comment"
            })];
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(data));
            store.getState().properties = data;
            (store.dispatch as ThunkDispatch)(getProperties());
            return Promise.resolve().then(() => {
                expect(store.getActions().length).toEqual(0);
            });
        });
    });

    describe("createProperty", () => {
        it("sends property data in JSON-LD to server", () => {
            const data = new RdfsResource({
                iri: "http://www.w3.org/2000/01/rdf-schema#label",
                label: "Label",
                comment: "Comment"
            });
            Ajax.post = jest.fn().mockImplementation(() => Promise.resolve());
            return Promise.resolve((store.dispatch as ThunkDispatch)(createProperty(data))).then(() => {
                expect(Ajax.post).toHaveBeenCalled();
                const payload = (Ajax.post as jest.Mock).mock.calls[0][1].getContent();
                expect(payload.iri).toEqual(data.iri);
                expect(payload.label).toEqual(data.label);
                expect(payload.comment).toEqual(data.comment);
                expect(payload["@context"]).toEqual(RDFS_RESOURCE_CONTEXT);
            });
        });
    });

    describe("load resources", () => {
        it("extracts resources from incoming JSON-LD", () => {
            const resources = require("../../rest-mock/resources");
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(resources));
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadResources())).then(() => {
                const loadSuccessAction: AsyncActionSuccess<Resource[]> = store.getActions()[1];
                const result = loadSuccessAction.payload;
                expect(result.length).toEqual(resources.length);
                result.sort((a, b) => a.iri.localeCompare(b.iri));
                resources.sort((a: object, b: object) => a["@id"].localeCompare(b["@id"]));
                for (let i = 0; i < resources.length; i++) {
                    expect(result[i].iri).toEqual(resources[i]["@id"]);
                }
            });
        });

        it("extracts single resource as an array of resources from incoming JSON-LD", () => {
            const resources = require("../../rest-mock/resources");
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve([resources[0]]));
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadResources())).then(() => {
                const loadSuccessAction: AsyncActionSuccess<Resource[]> = store.getActions()[1];
                const result = loadSuccessAction.payload;
                expect(Array.isArray(result)).toBeTruthy();
                expect(result.length).toEqual(1);
                expect(result[0].iri).toEqual(resources[0]["@id"]);
            });
        });

        it("does nothing when resources loading action is already pending", () => {
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve([]));

            store.getState().pendingActions[ActionType.LOAD_RESOURCES] = AsyncActionStatus.REQUEST;
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadResources())).then(() => {
                expect(Ajax.get).not.toHaveBeenCalled();
            });
        });
    });

    describe("loadResource", () => {

        it("returns resource as correct type based on type specified in JSON-LD data", () => {
            const iri = Generator.generateUri();
            const data = {
                "@id": iri,
                "@type": [VocabularyUtils.RESOURCE, VocabularyUtils.FILE]
            };
            data[VocabularyUtils.RDFS_LABEL] = "Test label";
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(data));
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadResource(VocabularyUtils.create(iri)))).then(() => {
                const loadSuccessAction: AsyncActionSuccess<Resource> = store.getActions()[1];
                const result = loadSuccessAction.payload;
                expect(result instanceof TermItFile).toBeTruthy();
            });
        });
    });

    describe("update resource terms", () => {
        it("sends put request to correct endpoint using resource IRI and term IRIs", () => {
            const namespace = "http://onto.fel.cvut.cz/ontologies/termit/vocabularies/";
            const normalizedResourceName = "test-resource";
            const normalizedTermName = "test-term";
            const term: Term = new Term({
                iri: namespace + "pojem/" + normalizedTermName,
                label: "Test",
                comment: "Test term"
            });
            const resource = new Resource({
                iri: namespace + normalizedResourceName,
                label: "Test resource",
                terms: [term]
            });
            const mock = jest.fn().mockImplementation(() => Promise.resolve());
            Ajax.put = mock;
            return Promise.resolve((store.dispatch as ThunkDispatch)(updateResourceTerms(resource))).then(() => {
                expect(Ajax.put).toHaveBeenCalled();
                const requestUri = mock.mock.calls[0][0];
                expect(requestUri).toEqual(Constants.API_PREFIX + "/resources/" + normalizedResourceName + "/terms");
                const params = mock.mock.calls[0][1].getParams();
                expect(params.namespace).toBeDefined();
                expect(params.namespace).toEqual(namespace);
                const content = mock.mock.calls[0][1].getContent();
                expect(content).toBeDefined();
            });
        });
    });

    describe("loadTermAssignmentsInfo", () => {

        const termIri = VocabularyUtils.create("http://onto.fel.cvut.cz/ontologies/termit/vocabularies/test-vocabulary/terms/test-term");
        const vocabularyIri = VocabularyUtils.create("http://onto.fel.cvut.cz/ontologies/termit/vocabularies/test-vocabulary");

        it("sends request to load term assignments from server", () => {
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve([]));
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadTermAssignmentsInfo(termIri, vocabularyIri))).then(() => {
                expect(Ajax.get).toHaveBeenCalled();
                const url = (Ajax.get as jest.Mock).mock.calls[0][0];
                expect(url.endsWith("/vocabularies/test-vocabulary/terms/test-term/assignments")).toBeTruthy();
                const config = (Ajax.get as jest.Mock).mock.calls[0][1];
                expect(config.getParams().namespace).toEqual("http://onto.fel.cvut.cz/ontologies/termit/vocabularies/");
            });
        });

        it("returns loaded data on success", () => {
            const data = [{
                "@context": TERM_ASSIGNMENTS_CONTEXT,
                iri: Generator.generateUri(),
                term: {
                    iri: termIri.toString()
                },
                resource: {
                    iri: Generator.generateUri()
                },
                label: "Test resource",
                types: [VocabularyUtils.TERM_ASSIGNMENT]
            }];
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(data));
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadTermAssignmentsInfo(termIri, vocabularyIri))).then((result: TermAssignments[]) => {
                expect(Ajax.get).toHaveBeenCalled();
                expect(result).toBeDefined();
                expect(result.length).toEqual(1);
                expect(result[0].term.iri).toEqual(data[0].term.iri);
            });
        });

        it("returns empty array when loading fails", () => {
            Ajax.get = jest.fn().mockImplementation(() => Promise.reject({msg: "Error"}));
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadTermAssignmentsInfo(termIri, vocabularyIri))).then((result: TermAssignments[]) => {
                expect(Ajax.get).toHaveBeenCalled();
                expect(result).toBeDefined();
                expect(result.length).toEqual(0);
            });
        });
    });

    describe("exportGlossary", () => {
        it("provides vocabulary normalized name and namespace in request", () => {
            const namespace = "http://onto.fel.cvut.cz/ontologies/termit/vocabularies/";
            const name = "test-vocabulary";
            Ajax.getRaw = jest.fn().mockImplementation(() => Promise.resolve({
                data: "test",
                headers: {"Content-type": "text/csv"}
            }));
            return Promise.resolve((store.dispatch as ThunkDispatch)(exportGlossary({
                namespace,
                fragment: name
            }, ExportType.CSV))).then(() => {
                expect(Ajax.getRaw).toHaveBeenCalled();
                const url = (Ajax.getRaw as jest.Mock).mock.calls[0][0];
                expect(url).toEqual(Constants.API_PREFIX + "/vocabularies/" + name + "/terms");
                const config = (Ajax.getRaw as jest.Mock).mock.calls[0][1];
                expect(config.getParams().namespace).toEqual(namespace);
            });
        });

        it("sets accept type to CSV when CSV export type is provided", () => {
            const iri = VocabularyUtils.create(Generator.generateUri());
            Ajax.getRaw = jest.fn().mockImplementation(() => Promise.resolve({
                data: "test",
                headers: {"Content-type": "text/csv"}
            }));
            return Promise.resolve((store.dispatch as ThunkDispatch)(exportGlossary(iri, ExportType.CSV))).then(() => {
                expect(Ajax.getRaw).toHaveBeenCalled();
                const config = (Ajax.getRaw as jest.Mock).mock.calls[0][1];
                expect(config.getAccept()).toEqual(Constants.CSV_MIME_TYPE);
            });
        });

        it("sets accept type to Excel when Excel export type is provided", () => {
            const iri = VocabularyUtils.create(Generator.generateUri());
            Ajax.getRaw = jest.fn().mockImplementation(() => Promise.resolve({
                data: "test",
                headers: {"Content-type": Constants.EXCEL_MIME_TYPE}
            }));
            return Promise.resolve((store.dispatch as ThunkDispatch)(exportGlossary(iri, ExportType.Excel))).then(() => {
                expect(Ajax.getRaw).toHaveBeenCalled();
                const config = (Ajax.getRaw as jest.Mock).mock.calls[0][1];
                expect(config.getAccept()).toEqual(Constants.EXCEL_MIME_TYPE);
            });
        });

        it("invokes file save on request success", () => {
            const iri = VocabularyUtils.create(Generator.generateUri());
            const data = "test";
            const fileName = "test.csv";
            Ajax.getRaw = jest.fn().mockImplementation(() => Promise.resolve({
                data,
                headers: {
                    "content-type": Constants.CSV_MIME_TYPE,
                    "content-disposition": "attachment; filename=\"" + fileName + "\""
                }
            }));
            Utils.fileDownload = jest.fn();
            return Promise.resolve((store.dispatch as ThunkDispatch)(exportGlossary(iri, ExportType.CSV))).then(() => {
                expect(Utils.fileDownload).toHaveBeenCalledWith(data, fileName, Constants.CSV_MIME_TYPE);
            });
        });

        it("dispatches async success on request success and correct data", () => {
            const iri = VocabularyUtils.create(Generator.generateUri());
            const data = "test";
            const fileName = "test.csv";
            Ajax.getRaw = jest.fn().mockImplementation(() => Promise.resolve({
                data,
                headers: {
                    "content-type": Constants.CSV_MIME_TYPE,
                    "content-disposition": "attachment; filename=\"" + fileName + "\""
                }
            }));
            Utils.fileDownload = jest.fn();
            return Promise.resolve((store.dispatch as ThunkDispatch)(exportGlossary(iri, ExportType.CSV))).then(() => {
                expect(store.getActions().length).toEqual(2);
                const successAction = store.getActions()[1];
                expect(successAction.type).toEqual(ActionType.EXPORT_GLOSSARY);
                expect(successAction.status).toEqual(AsyncActionStatus.SUCCESS);
            });
        });

        it("dispatches failure when response does not contain correct data", () => {
            const iri = VocabularyUtils.create(Generator.generateUri());
            const data = "test";
            Ajax.getRaw = jest.fn().mockImplementation(() => Promise.resolve({
                data,
                headers: {
                    "content-type": Constants.CSV_MIME_TYPE
                }
            }));
            Utils.fileDownload = jest.fn();
            return Promise.resolve((store.dispatch as ThunkDispatch)(exportGlossary(iri, ExportType.CSV))).then(() => {
                expect(store.getActions().length).toEqual(3);
                const successAction = store.getActions()[1];
                expect(successAction.type).toEqual(ActionType.EXPORT_GLOSSARY);
                expect(successAction.status).toEqual(AsyncActionStatus.FAILURE);
            });
        });
    });

    describe("loadLastEditedAssets", () => {
        it("returns correct instances of received asset data", () => {
            const data = [{
                "@id": Generator.generateUri(),
                "http://www.w3.org/2000/01/rdf-schema#label": "Test file",
                "@type": [VocabularyUtils.FILE, VocabularyUtils.RESOURCE]
            }, {
                "@id": Generator.generateUri(),
                "http://www.w3.org/2000/01/rdf-schema#label": "Test vocabulary",
                "@type": [VocabularyUtils.VOCABULARY]
            }, {
                "@id": Generator.generateUri(),
                "http://www.w3.org/2000/01/rdf-schema#label": "Test term",
                "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/je-pojmem-ze-slovniku": {"@id": Generator.generateUri()},
                "@type": [VocabularyUtils.TERM]
            }];
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(data));
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadLastEditedAssets())).then((result: Asset[]) => {
                expect(Ajax.get).toHaveBeenCalledWith(Constants.API_PREFIX + "/assets/last-edited");
                expect(result.length).toEqual(data.length);
                expect(result[0]).toBeInstanceOf(TermItFile);
                expect(result[1]).toBeInstanceOf(Vocabulary);
                expect(result[2]).toBeInstanceOf(Term);
            });
        });
    });

    describe("create resource", () => {
        it("adds context definition to resource data and sends it over network", () => {
            const resource = new Resource({
                iri: Generator.generateUri(),
                label: "Test resource"
            });
            const mock = jest.fn().mockImplementation(() => Promise.resolve());
            Ajax.post = mock;
            return Promise.resolve((store.dispatch as ThunkDispatch)(createResource(resource))).then(() => {
                expect(Ajax.post).toHaveBeenCalled();
                const config = mock.mock.calls[0][1];
                expect(config.getContentType()).toEqual(Constants.JSON_LD_MIME_TYPE);
                const data = config.getContent();
                expect(data["@context"]).toBeDefined();
                expect(data["@context"]).toEqual(RESOURCE_CONTEXT);
            });
        });

        it("returns new resource IRI on success", () => {
            const resource = new Resource({
                iri: "http://onto.fel.cvut.cz/ontologies/termit/resources/test-resource",
                label: "Test resource"
            });
            Ajax.post = jest.fn().mockImplementation(() => Promise.resolve({headers: {location: resource.iri}}));
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve([]));
            return Promise.resolve((store.dispatch as ThunkDispatch)(createResource(resource))).then((res: string) => {
                expect(res).toEqual(resource.iri);
            });
        });

        it("refreshes resource list on success", () => {
            const resource = new Resource({
                iri: Generator.generateUri(),
                label: "Test resource"
            });
            Ajax.post = jest.fn().mockImplementation(() => Promise.resolve());
            return Promise.resolve((store.dispatch as ThunkDispatch)(createResource(resource))).then(() => {
                const actions = store.getActions();
                expect(actions.find(a => a.type === ActionType.LOAD_RESOURCES)).toBeDefined();
            });
        });
    });

    describe("removeResource", () => {
        it("sends delete resource request to the server", () => {
            const normalizedName = "test-resource";
            const namespace = "http://onto.fel.cvut.cz/ontologies/termit/resources/";
            const resource = new Resource({
                iri: namespace + normalizedName,
                label: "Test resource"
            });
            Ajax.delete = jest.fn().mockImplementation(() => Promise.resolve());
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve([]));
            return Promise.resolve((store.dispatch as ThunkDispatch)(removeResource(resource))).then(() => {
                expect(Ajax.delete).toHaveBeenCalled();
                const call = (Ajax.delete as jest.Mock).mock.calls[0];
                expect(call[0]).toEqual(Constants.API_PREFIX + "/resources/" + normalizedName);
                expect(call[1].getParams().namespace).toEqual(namespace);
            });
        });

        it("refreshes resource list on success", () => {
            const resource = new Resource({
                iri: Generator.generateUri(),
                label: "Test resource"
            });
            Ajax.delete = jest.fn().mockImplementation(() => Promise.resolve());
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve([]));
            return Promise.resolve((store.dispatch as ThunkDispatch)(removeResource(resource))).then(() => {
                const actions = store.getActions();
                expect(actions.find(a => a.type === ActionType.LOAD_RESOURCES)).toBeDefined();
            });
        });

        it("transitions to resource management on success", () => {
            const resource = new Resource({
                iri: Generator.generateUri(),
                label: "Test resource"
            });
            Ajax.delete = jest.fn().mockImplementation(() => Promise.resolve());
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve([]));
            return Promise.resolve((store.dispatch as ThunkDispatch)(removeResource(resource))).then(() => {
                expect(Routing.transitionTo).toHaveBeenCalledWith(Routes.resources);
            });
        });
    });

    describe("loadResourceTermAssignmentsInfo", () => {
        const resource = new Resource({
            iri: Generator.generateUri(),
            label: "Test resource"
        });

        it("sends request to correct endpoint", () => {
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve([]));
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadResourceTermAssignmentsInfo(VocabularyUtils.create(resource.iri)))).then(() => {
                const endpoint = (Ajax.get as jest.Mock).mock.calls[0][0];
                expect(endpoint).toEqual(Constants.API_PREFIX + "/resources/" + VocabularyUtils.create(resource.iri).fragment + "/assignments/aggregated");
            });
        });

        it("returns loaded assignments", () => {
            const data = [{
                "@context": RESOURCE_TERM_ASSIGNMENT_CONTEXT,
                iri: Generator.generateUri(),
                term: {
                    iri: Generator.generateUri(),
                },
                resource,
                vocabulary: {
                    iri: Generator.generateUri()
                },
                types: [VocabularyUtils.TERM_ASSIGNMENT]
            }];
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(data));
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadResourceTermAssignmentsInfo(VocabularyUtils.create(resource.iri)))).then((result: ResourceTermAssignments[]) => {
                expect(result.length).toEqual(1);
                expect(result[0].term.iri).toEqual(data[0].term.iri);
            });
        });

        it("passes loaded terms assigned to resource to store", () => {
            const data = [{
                "@context": RESOURCE_TERM_ASSIGNMENT_CONTEXT,
                iri: Generator.generateUri(),
                term: {
                    iri: Generator.generateUri(),
                },
                label: "Test term",
                resource,
                vocabulary: {
                    iri: Generator.generateUri()
                },
                types: [VocabularyUtils.TERM_ASSIGNMENT]
            }, {
                "@context": RESOURCE_TERM_ASSIGNMENT_CONTEXT,
                iri: Generator.generateUri(),
                term: {
                    iri: Generator.generateUri(),
                },
                label: "Test term",
                resource,
                vocabulary: {
                    iri: Generator.generateUri()
                },
                count: 117,
                types: [VocabularyUtils.TERM_ASSIGNMENT, VocabularyUtils.TERM_OCCURRENCE]
            }];
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(data));
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadResourceTermAssignmentsInfo(VocabularyUtils.create(resource.iri)))).then(() => {
                const actions = store.getActions();
                const termsAction = actions.find(a => a.type === ActionType.LOAD_RESOURCE_TERMS);
                expect(termsAction).toBeDefined();
                expect(termsAction.payload).toEqual([new Term({
                    iri: data[0].term.iri,
                    label: data[0].label,
                    vocabulary: data[0].vocabulary
                })]);
            });
        });
    });

    describe("uploadFileContent", () => {
        const fileIri = "http://onto.fel.cvut.cz/ontologies/termit/resources/test.html";
        const fileName = "test.html";

        it("attaches file data to server request", () => {
            Ajax.put = jest.fn().mockImplementation(() => Promise.resolve());
            const blob = new Blob([""], {type: "text/html"});
            // @ts-ignore
            blob["name"] = fileName;
            return Promise.resolve((store.dispatch as ThunkDispatch)(uploadFileContent(VocabularyUtils.create(fileIri), blob as File))).then(() => {
                const actions = store.getActions();
                expect(actions[0].type).toEqual(ActionType.SAVE_FILE_CONTENT);
                const args = (Ajax.put as jest.Mock).mock.calls[0];
                expect(args[1].getFormData().get("file").name).toEqual(fileName);
            });
        });
    });

    describe("createFileInDocument", () => {
        it("POSTs File metadata to server under the specified Document identifier", () => {
            const file = new TermItFile({
                iri: Generator.generateUri(),
                label: "test.html"
            });
            const docName = "test-document";
            const documentIri = VocabularyUtils.create("http://onto.fel.cvut.cz/ontologies/termit/resources/test-document");
            Ajax.post = jest.fn().mockImplementation(() => Promise.resolve({headers: {location: file.iri}}));
            return Promise.resolve((store.dispatch as ThunkDispatch)(createFileInDocument(file, documentIri))).then(() => {
                const actions = store.getActions();
                expect(actions[0].type).toEqual(ActionType.CREATE_RESOURCE);
                expect((Ajax.post as jest.Mock).mock.calls[0][0]).toEqual(Constants.API_PREFIX + "/resources/" + docName + "/files");
                expect((Ajax.post as jest.Mock).mock.calls[0][1].getContent()).toEqual(file.toJsonLd());
            });
        });
    });

    describe("loadLatestTextAnalysisRecord", () => {
        it("loads text analysis record for specified resource", () => {
            const resourceIri = VocabularyUtils.create("http://onto.fel.cvut.cz/ontologies/termit/resources/test-file.html");
            const record = {
                "@context": TA_RECORD_CONTEXT,
                iri: Generator.generateUri(),
                analyzedResource: {
                    iri: resourceIri.toString(),
                    label: "test-file.html"
                },
                vocabularies: [{iri: Generator.generateUri()}],
                created: Date.now()
            };
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(record));
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadLatestTextAnalysisRecord(resourceIri))).then((data: TextAnalysisRecord) => {
                expect(data.analyzedResource).toEqual(record.analyzedResource);
                expect(Ajax.get).toHaveBeenCalledWith(Constants.API_PREFIX + "/resources/" + resourceIri.fragment + "/text-analysis/records/latest", param("namespace", resourceIri.namespace));
            });
        });

        it("returns null when no record exists", () => {
            const resourceIri = VocabularyUtils.create("http://onto.fel.cvut.cz/ontologies/termit/resources/test-file.html");
            Ajax.get = jest.fn().mockImplementation(() => Promise.reject({status: 404}));
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadLatestTextAnalysisRecord(resourceIri))).then((data: TextAnalysisRecord | null) => {
                expect(data).toBeNull();
                expect(Ajax.get).toHaveBeenCalledWith(Constants.API_PREFIX + "/resources/" + resourceIri.fragment + "/text-analysis/records/latest", param("namespace", resourceIri.namespace));
            });
        });
    });

    describe("hasFileContent", () => {
        it("returns true when response is positive", () => {
            const resourceIri = VocabularyUtils.create("http://onto.fel.cvut.cz/ontologies/termit/resources/test-file.html");
            Ajax.head = jest.fn().mockImplementation(() => Promise.resolve({status: 204}));
            return Promise.resolve((store.dispatch as ThunkDispatch)(hasFileContent(resourceIri))).then((result: boolean) => {
                expect(result).toBeTruthy();
                expect(Ajax.head).toHaveBeenCalled();
            });
        });

        it("returns false when response is negative", () => {
            const resourceIri = VocabularyUtils.create("http://onto.fel.cvut.cz/ontologies/termit/resources/test-file.html");
            Ajax.head = jest.fn().mockImplementation(() => Promise.reject({status: 404}));
            return Promise.resolve((store.dispatch as ThunkDispatch)(hasFileContent(resourceIri))).then((result: boolean) => {
                expect(result).toBeFalsy();
                expect(Ajax.head).toHaveBeenCalled();
            });
        });
    });

    describe("exportFileContent", () => {
        const fileName = "test-file.html";
        const fileIri = VocabularyUtils.create("http://onto.fel.cvut.cz/ontologies/termit/resources/" + fileName);

        it("sends request asking for content as attachment", () => {
            Ajax.getRaw = jest.fn().mockImplementation(() => Promise.resolve({
                data: "test",
                headers: {
                    "content-type": "text/html",
                    "content-disposition": "attachment; filename=\"" + fileName + "\""
                }
            }));
            Utils.fileDownload = jest.fn();
            return Promise.resolve((store.dispatch as ThunkDispatch)(exportFileContent(fileIri))).then(() => {
                expect(Ajax.getRaw).toHaveBeenCalled();
                const url = (Ajax.getRaw as jest.Mock).mock.calls[0][0];
                expect(url).toEqual(Constants.API_PREFIX + "/resources/" + fileName + "/content");
                const config = (Ajax.getRaw as jest.Mock).mock.calls[0][1];
                expect(config.getParams().attachment).toEqual("true");
                expect(config.getParams().namespace).toEqual(fileIri.namespace);
            });
        });

        it("stores response attachment", () => {
            const data = "<html lang=\"en\">test</html>";
            Ajax.getRaw = jest.fn().mockImplementation(() => Promise.resolve({
                data,
                headers: {
                    "content-type": "text/html",
                    "content-disposition": "attachment; filename=\"" + fileName + "\""
                }
            }));
            Utils.fileDownload = jest.fn();
            return Promise.resolve((store.dispatch as ThunkDispatch)(exportFileContent(fileIri))).then(() => {
                expect(Utils.fileDownload).toHaveBeenCalled();
                const args = (Utils.fileDownload as jest.Mock).mock.calls[0];
                expect(args[0]).toEqual(data);
                expect(args[1]).toEqual(fileName);
                expect(args[2]).toEqual("text/html");
            });
        });
    });

    describe("loadImportedVocabularies", () => {

        it("loads imported vocabularies for the specified vocabulary IRI", () => {
            const imports = [Generator.generateUri(), Generator.generateUri()];
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(imports));
            const iri = VocabularyUtils.create(Generator.generateUri());
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadImportedVocabularies(iri))).then(() => {
                expect(Ajax.get).toHaveBeenCalled();
                const url = (Ajax.get as jest.Mock).mock.calls[0][0];
                expect(url).toEqual(Constants.API_PREFIX + "/vocabularies/" + iri.fragment + "/imports");
            });
        });

        it("returns loaded imports", () => {
            const imports = [Generator.generateUri(), Generator.generateUri()];
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(imports));
            const iri = VocabularyUtils.create(Generator.generateUri());
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadImportedVocabularies(iri))).then((result) => {
                expect(result).toEqual(imports);
            });
        });

        it("returns empty array on error on request error", () => {
            Ajax.get = jest.fn().mockImplementation(() => Promise.reject({}));
            const iri = VocabularyUtils.create(Generator.generateUri());
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadImportedVocabularies(iri))).then((result) => {
                expect(result).toEqual([]);
            });
        });
    });
});
