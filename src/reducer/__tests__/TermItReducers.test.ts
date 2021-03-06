import reducers from "../TermItReducers";
import ActionType, {AsyncActionSuccess, FailureAction} from "../../action/ActionType";
import TermItState from "../../model/TermItState";
import {
    asyncActionFailure,
    asyncActionRequest,
    asyncActionSuccess,
    asyncActionSuccessWithPayload,
    clearErrors,
    clearProperties,
    clearResource,
    consumeNotification,
    dismissMessage,
    publishMessage,
    publishNotification,
    selectVocabularyTerm,
    switchLanguage,
    updateLastModified,
    userLogout
} from "../../action/SyncActions";
import ErrorInfo, {ErrorData} from "../../model/ErrorInfo";
import User, {EMPTY_USER} from "../../model/User";
import Message from "../../model/Message";
import Constants from "../../util/Constants";
import Vocabulary, {EMPTY_VOCABULARY, VocabularyData} from "../../model/Vocabulary";
import AsyncActionStatus from "../../action/AsyncActionStatus";
import Term, {TermData} from "../../model/Term";
import RdfsResource from "../../model/RdfsResource";
import AppNotification from "../../model/AppNotification";
import Resource, {EMPTY_RESOURCE} from "../../model/Resource";
import Generator from "../../__tests__/environment/Generator";
import SearchQuery from "../../model/SearchQuery";
import QueryResult from "../../model/QueryResult";
import File from "../../model/File";
import VocabularyUtils from "../../util/VocabularyUtils";
import Workspace from "../../model/Workspace";

function stateToPlainObject(state: TermItState): TermItState {
    return {
        loading: state.loading,
        user: state.user,
        vocabulary: state.vocabulary,
        vocabularies: state.vocabularies,
        queryResults: state.queryResults,
        messages: state.messages,
        intl: state.intl,
        selectedTerm: state.selectedTerm,
        createdTermsCounter: state.createdTermsCounter,
        fileContent: state.fileContent,
        facetedSearchResult: state.facetedSearchResult,
        searchListenerCount: state.searchListenerCount,
        searchInProgress: state.searchInProgress,
        searchQuery: state.searchQuery,
        searchResults: state.searchResults,
        types: state.types,
        resource: state.resource,
        resources: state.resources,
        properties: state.properties,
        notifications: state.notifications,
        pendingActions: state.pendingActions,
        errors: state.errors,
        lastModified: state.lastModified,
        labelCache: state.labelCache,
        workspace: state.workspace
    };
}

describe("Reducers", () => {

    let initialState = new TermItState();

    beforeEach(() => {
        initialState = new TermItState();
    });

    describe("loading user", () => {
        const action = {type: ActionType.FETCH_USER};
        it("sets user in state on user load success", () => {
            const user = new User({
                iri: "http://test",
                firstName: "test",
                lastName: "test",
                username: "test@kbss.felk.cvut.cz"
            });
            const a: AsyncActionSuccess<User> = asyncActionSuccessWithPayload(action, user);
            expect(reducers(undefined, a)).toEqual(Object.assign({}, initialState, {user}));
        });

        it("sets loading status when user fetch is initiated", () => {
            const a = asyncActionRequest(action);
            expect(reducers(undefined, a).loading).toBeTruthy();
        });

        it("sets loading status to false on user load success", () => {
            const user = new User({
                iri: "http://test",
                firstName: "test",
                lastName: "test",
                username: "test@kbss.felk.cvut.cz"
            });
            const a: AsyncActionSuccess<User> = asyncActionSuccessWithPayload(action, user);
            initialState.loading = true;
            expect(reducers(stateToPlainObject(initialState), a)).toEqual(Object.assign({}, initialState, {
                user,
                loading: false
            }));
        });

        it("sets loading status to false on user load failure", () => {
            const error = new ErrorInfo(ActionType.FETCH_USER, {
                message: "Failed to connect to server",
                requestUrl: "/users/current"
            });
            const a: FailureAction = asyncActionFailure(action, error);
            initialState.loading = true;
            expect(reducers(stateToPlainObject(initialState), a).loading).toBeFalsy();
        });
    });

    describe("login", () => {
        const action = {type: ActionType.LOGIN};
        it("sets loading status on login request", () => {
            const a = asyncActionRequest(action);
            expect(reducers(stateToPlainObject(initialState), a).loading).toBeTruthy();
        });

        it("sets loading status to false on login success", () => {
            const a = asyncActionSuccess(action);
            initialState.loading = true;
            expect(reducers(stateToPlainObject(initialState), a).loading).toBeFalsy();
        });

        it("sets loading status to false on login failure", () => {
            const error = new ErrorInfo(ActionType.LOGIN, {
                message: "Incorrect password",
                requestUrl: "/j_spring_security_check"
            });
            const a = asyncActionFailure(action, error);
            initialState.loading = true;
            expect(reducers(stateToPlainObject(initialState), a).loading).toBeFalsy();
        });
    });

    describe("messages", () => {
        it("adds message into message array on publish message action", () => {
            const mOne = new Message({
                message: "test"
            });
            const action = publishMessage(mOne);
            expect(reducers(stateToPlainObject(initialState), action)).toEqual(Object.assign({}, initialState, {messages: [mOne]}));
            const mTwo = new Message({
                messageId: "connection.error"
            });
            const actionTwo = publishMessage(mTwo);
            initialState.messages = [mOne];
            expect(reducers(stateToPlainObject(initialState), actionTwo)).toEqual(Object.assign({}, initialState, {messages: [mOne, mTwo]}));
        });

        it("removes message from array on dismiss message action", () => {
            const mOne = new Message({
                message: "test"
            });
            const mTwo = new Message({
                messageId: "connection.error"
            });
            initialState.messages = [mOne, mTwo];
            const action = dismissMessage(mOne);
            expect(reducers(stateToPlainObject(initialState), action)).toEqual(Object.assign({}, initialState, {messages: [mTwo]}));
        });
    });

    describe("intl", () => {
        it("loads localization data on action", () => {
            const action = switchLanguage(Constants.LANG.CS.locale);
            expect(reducers(stateToPlainObject(initialState), action)).toEqual(Object.assign({}, initialState, {intl: require("../../i18n/cs").default}));
        });

        it("clears types on language switch, because they are language-dependent", () => {
            const type = Generator.generateTerm();
            initialState.types[type.iri] = type;
            const action = switchLanguage(Constants.LANG.CS.locale);
            expect(reducers(stateToPlainObject(initialState), action).types).toEqual({});
        });
    });

    describe("logout", () => {
        it("resets current user to empty user", () => {
            initialState.user = new User({
                iri: "http://test",
                firstName: "test",
                lastName: "test",
                username: "test@kbss.felk.cvut.cz"
            });
            expect(reducers(stateToPlainObject(initialState), userLogout())).toEqual(Object.assign({}, initialState, {user: EMPTY_USER}));
        });

        it("resets vocabularies and current vocabulary", () => {
            initialState.vocabularies = require("../../rest-mock/vocabularies.json");
            initialState.vocabulary = initialState.vocabularies[0];
            expect(reducers(stateToPlainObject(initialState), userLogout())).toEqual(Object.assign({}, initialState, {
                vocabulary: EMPTY_VOCABULARY,
                vocabularies: {}
            }));
        });

        it("resets resources, current resource and file content", () => {
            initialState.resources = require("../../rest-mock/resources.json");
            initialState.resource = require("../../rest-mock/resource.json");
            initialState.fileContent = "test";
            expect(reducers(stateToPlainObject(initialState), userLogout())).toEqual(Object.assign({}, initialState, {
                resource: EMPTY_RESOURCE,
                resources: {},
                fileContent: null
            }));
        });

        it("resets selected term and terms counter", () => {
            initialState.selectedTerm = Generator.generateTerm();
            initialState.createdTermsCounter = 2;
            expect(reducers(stateToPlainObject(initialState), userLogout())).toEqual(Object.assign({}, initialState, {
                selectedTerm: null,
                createdTermsCounter: 0
            }));
        });

        it("resets search-related state", () => {
            initialState.searchResults = require("../../rest-mock/searchResults.json");
            initialState.searchQuery = new SearchQuery();
            initialState.searchQuery.searchQuery = "hello";
            initialState.searchInProgress = true;
            initialState.facetedSearchResult = {search: "test", anotherAtt: "yas"};
            initialState.queryResults = {"test": new QueryResult("test", {})};
            initialState.searchListenerCount = 2;
            expect(reducers(stateToPlainObject(initialState), userLogout())).toEqual(Object.assign({}, initialState, {
                searchResults: null,
                searchQuery: new SearchQuery(),
                searchInProgress: false,
                facetedSearchResult: {},
                searchListenerCount: 0,
                queryResults: {}
            }));
        });
    });

    describe("loading vocabulary", () => {
        const action = {type: ActionType.LOAD_VOCABULARY};

        it("sets vocabulary when it was successfully loaded", () => {
            const vocabularyData: VocabularyData = {
                label: "Test vocabulary",
                iri: "http://onto.fel.cvut.cz/ontologies/termit/vocabulary/test-vocabulary"
            };
            expect(reducers(stateToPlainObject(initialState), asyncActionSuccessWithPayload(action, new Vocabulary(vocabularyData))))
                .toEqual(Object.assign({}, initialState, {vocabulary: new Vocabulary(vocabularyData)}));
        });

        it("sets transitive imports on vocabulary when they are loaded", () => {
            const imports = [Generator.generateUri(), Generator.generateUri()];
            initialState.vocabulary = new Vocabulary({
                label: "Test vocabulary",
                iri: "http://onto.fel.cvut.cz/ontologies/termit/vocabulary/test-vocabulary"
            });
            const vocabulary = reducers(stateToPlainObject(initialState), asyncActionSuccessWithPayload({type: ActionType.LOAD_VOCABULARY_IMPORTS}, imports)).vocabulary;
            expect(vocabulary.allImportedVocabularies).toEqual(imports);
        });
    });

    describe("select term", () => {
        it("sets selectedTerm when it was successfully selected", () => {
            const term: TermData = {
                label: "Test term",
                iri: "http://onto.fel.cvut.cz/ontologies/termit/vocabulary/test-vocabulary/term/test-term"
            };
            expect(reducers(stateToPlainObject(initialState), selectVocabularyTerm(term)))
                .toEqual(Object.assign({}, initialState, {selectedTerm: new Term(term)}));
        });

        it("sets selectedTerm when it was successfully selected then deselect it", () => {
            const term: TermData = {
                label: "Test term",
                iri: "http://onto.fel.cvut.cz/ontologies/termit/vocabulary/test-vocabulary/term/test-term"
            };
            expect(reducers(stateToPlainObject(initialState), selectVocabularyTerm(term)))
                .toEqual(Object.assign({}, initialState, {selectedTerm: new Term(term)}));
            expect(reducers(stateToPlainObject(initialState), selectVocabularyTerm(null)))
                .toEqual(Object.assign({}, initialState, {selectedTerm: null}));
        });
    });

    describe("load types", () => {
        it("sets default terms when it was successfully loaded", () => {
            const terms: TermData[] = [
                {
                    label: "Test type 1",
                    iri: "http://onto.fel.cvut.cz/ontologies/termit/vocabulary/test-vocabulary/term/test-type-1"
                },
                {
                    label: "Test type 2",
                    iri: "http://onto.fel.cvut.cz/ontologies/termit/vocabulary/test-vocabulary/term/test-type-2"
                }
            ];

            const map = {};
            terms.forEach((v: TermData) =>
                map[(v.iri || "")] = new Term(v)
            );

            expect(reducers(stateToPlainObject(initialState), asyncActionSuccessWithPayload({type: ActionType.LOAD_TYPES}, terms.map(vt => new Term(vt)))))
                .toEqual(Object.assign({}, initialState, {types: map}));
        });
    });

    it("does not change loading status on request action with ignoreLoading specified", () => {
        const action = {
            type: ActionType.SEARCH,
            status: AsyncActionStatus.REQUEST,
            ignoreLoading: true
        };
        expect(reducers(stateToPlainObject(initialState), action).loading).toEqual(initialState.loading);
    });

    describe("properties", () => {
        it("sets properties when they were successfully loaded", () => {
            const properties: RdfsResource[] = [new RdfsResource({
                iri: "http://www.w3.org/2000/01/rdf-schema#label",
                label: "Label",
                comment: "RDFS label property"
            })];
            expect(reducers(stateToPlainObject(initialState), asyncActionSuccessWithPayload({type: ActionType.GET_PROPERTIES}, properties)))
                .toEqual(Object.assign({}, initialState, {properties}));
        });

        it("clear properties on clearProperties action", () => {
            initialState.properties = [new RdfsResource({
                iri: "http://www.w3.org/2000/01/rdf-schema#label",
                label: "Label",
                comment: "RDFS label property"
            })];
            expect(reducers(stateToPlainObject(initialState), clearProperties())).toEqual(Object.assign({}, initialState, {properties: []}));
        });
    });

    describe("notifications", () => {
        it("appends notification into queue on publish notification action", () => {
            const notification: AppNotification = {
                source: {
                    type: ActionType.CREATE_VOCABULARY_TERM,
                    status: AsyncActionStatus.SUCCESS
                }
            };
            expect(reducers(stateToPlainObject(initialState), publishNotification(notification)))
                .toEqual(Object.assign({}, initialState, {notifications: [notification]}));
        });

        it("removes notification from queue on consume notification action", () => {
            const notification: AppNotification = {
                source: {
                    type: ActionType.CREATE_VOCABULARY_TERM,
                    status: AsyncActionStatus.SUCCESS
                }
            };
            initialState.notifications = [notification];
            expect(reducers(stateToPlainObject(initialState), consumeNotification(notification)))
                .toEqual(Object.assign({}, initialState, {notifications: []}));
        });

        it("does nothing when unknown notification is consumed", () => {
            const notification: AppNotification = {
                source: {
                    type: ActionType.CREATE_VOCABULARY_TERM,
                    status: AsyncActionStatus.SUCCESS
                }
            };
            initialState.notifications = [notification];
            const another: AppNotification = {
                source: {type: ActionType.SWITCH_LANGUAGE}
            };
            expect(reducers(stateToPlainObject(initialState), consumeNotification(another))).toEqual(initialState);
        });
    });

    describe("resource", () => {
        it("resets resource to empty on clear resource action", () => {
            initialState.resource = new Resource({iri: Generator.generateUri(), label: "Resource"});
            expect(reducers(stateToPlainObject(initialState), clearResource())).toEqual(Object.assign(initialState, {resource: EMPTY_RESOURCE}));
        });
    });

    describe("pendingActions", () => {
        it("adds action to pendingActions when it is async request action", () => {
            const action = asyncActionRequest({type: ActionType.LOAD_RESOURCES}, true);
            const added = {};
            added[ActionType.LOAD_RESOURCES] = AsyncActionStatus.REQUEST;
            expect(reducers(stateToPlainObject(initialState), action)).toEqual(Object.assign(initialState, {pendingActions: added}));
        });

        it("does nothing when action is not asynchronous", () => {
            expect(reducers(stateToPlainObject(initialState), {type: ActionType.CLEAR_RESOURCE})).toEqual(initialState);
        });

        it("removes action from pendingActions when it is async success action", () => {
            const added = {};
            added[ActionType.LOAD_RESOURCES] = AsyncActionStatus.REQUEST;
            initialState.pendingActions = added;
            expect(reducers(stateToPlainObject(initialState), asyncActionSuccessWithPayload({type: ActionType.LOAD_RESOURCES}, []))).toEqual(Object.assign(initialState, {pendingActions: {}}));
        });

        it("removes action from pendingActions when it is async failure action", () => {
            const added = {};
            added[ActionType.LOAD_RESOURCES] = AsyncActionStatus.REQUEST;
            initialState.pendingActions = added;
            expect(reducers(stateToPlainObject(initialState), asyncActionFailure({type: ActionType.LOAD_RESOURCES}, {status: 404})).pendingActions).toEqual({});
        });

        it("does nothing when the same async action request is registered multiple times", () => {
            const added = {};
            added[ActionType.LOAD_RESOURCES] = AsyncActionStatus.REQUEST;
            initialState.pendingActions = added;
            const action = asyncActionRequest({type: ActionType.LOAD_RESOURCES}, true);
            expect(Object.is(reducers(stateToPlainObject(initialState), action).pendingActions, initialState.pendingActions)).toBeTruthy();
        });
    });

    describe("errors", () => {
        it("records error with timestamp", () => {
            const error: ErrorData = {message: "Login failed", status: 500};
            const result = reducers(stateToPlainObject(initialState), asyncActionFailure({type: ActionType.LOGIN}, error)).errors;
            expect(result.length).toEqual(1);
            expect(result[0].timestamp).toBeDefined();
            expect(result[0].error).toEqual(new ErrorInfo(ActionType.LOGIN, error));
        });

        it("records errors from latest to oldest", () => {
            const errorOne: ErrorData = {message: "Fetch user failed", status: 500};
            const errorTwo: ErrorData = {message: "Login failed", status: 400};
            const tempState = reducers(stateToPlainObject(initialState), asyncActionFailure({type: ActionType.FETCH_USER}, errorOne));
            const result = reducers(stateToPlainObject(tempState), asyncActionFailure({type: ActionType.LOGIN}, errorTwo)).errors;
            expect(result.length).toEqual(2);
            expect(result[0].error.origin).toEqual(ActionType.LOGIN);
            expect(result[1].error.origin).toEqual(ActionType.FETCH_USER);
        });

        it("does nothing when action is no error", () => {
            expect(reducers(stateToPlainObject(initialState), asyncActionSuccess({type: ActionType.LOGIN})).errors).toEqual([]);
        });

        it("clears errors on clear errors action", () => {
            initialState.errors = [{
                timestamp: Date.now(),
                error: new ErrorInfo(ActionType.FETCH_USER, {message: "Connection error"})
            }];
            expect(reducers(stateToPlainObject(initialState), clearErrors()).errors).toEqual([]);
        });
    });

    describe("loadResourceTerms", () => {
        it("does not change the type of resource stored in state", () => {
            initialState.resource = new File(Object.assign(Generator.generateAssetData(), {types: [VocabularyUtils.RESOURCE, VocabularyUtils.FILE]}));
            const result = reducers(stateToPlainObject(initialState),
                asyncActionSuccessWithPayload({type: ActionType.LOAD_RESOURCE_TERMS}, [Generator.generateTerm()])).resource;
            expect(result instanceof File).toBeTruthy();
        });
    });

    describe("lastModified", () => {
        it("sets last modified value on UpdateLastModified action", () => {
            const value = new Date().toISOString();
            const result = reducers(stateToPlainObject(initialState), updateLastModified(VocabularyUtils.VOCABULARY, value));
            expect(result.lastModified[VocabularyUtils.VOCABULARY]).toEqual(value);
        });
    });

    describe("labelCache", () => {
        it("stores loaded label under the identifier for which the label was loaded", () => {
            const iri = Generator.generateUri();
            const label = "Test label";
            const payload = {};
            payload[iri] = label;
            const result = reducers(stateToPlainObject(initialState), asyncActionSuccessWithPayload({type: ActionType.GET_LABEL}, payload));
            expect(result.labelCache[iri]).toBeDefined();
            expect(result.labelCache[iri]).toEqual(label);
        });
    });

    describe("workspace", () => {
        it("sets loaded workspace as current one in store", () => {
            const ws = new Workspace({iri: Generator.generateUri(), label: "Test workspace"});
            expect(stateToPlainObject(initialState).workspace).toBeNull();
            const result = reducers(stateToPlainObject(initialState), asyncActionSuccessWithPayload({type: ActionType.SELECT_WORKSPACE}, ws));
            expect(result.workspace).toEqual(ws);
        });
    });
});
