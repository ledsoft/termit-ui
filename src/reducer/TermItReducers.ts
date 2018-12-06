import {Action, combineReducers} from "redux";
import ActionType, {
    AsyncAction,
    AsyncActionSuccess,
    ClearErrorAction,
    ExecuteQueryAction,
    FacetedSearchAction,
    FailureAction,
    MessageAction, NotificationAction,
    SelectingTermsAction,
    SwitchLanguageAction
} from '../action/ActionType';
import TermItState from "../model/TermItState";
import User, {EMPTY_USER} from "../model/User";
import ErrorInfo, {EMPTY_ERROR} from "../model/ErrorInfo";
import Message from "../model/Message";
import IntlData from "../model/IntlData";
import {loadInitialLocalizationData, loadLocalizationData} from "../util/IntlUtil";
import AsyncActionStatus from "../action/AsyncActionStatus";
import Vocabulary, {EMPTY_VOCABULARY} from "../model/Vocabulary";
import Resource, {EMPTY_RESOURCE} from "../model/Resource";
import {default as QueryResult, QueryResultIF} from "../model/QueryResult";
import Term from "../model/Term";
import Document, {EMPTY_DOCUMENT} from "../model/Document";
import RdfsResource from "../model/RdfsResource";
import AppNotification from "../model/AppNotification";

/**
 * Handles changes to the currently logged in user.
 *
 * The initial state is an empty user, which basically shouldn't be allowed to do anything.
 */
function user(state: User = EMPTY_USER, action: AsyncActionSuccess<User>): User {
    switch (action.type) {
        case ActionType.FETCH_USER:
            return action.status === AsyncActionStatus.SUCCESS ? action.payload : state;
        case ActionType.LOGOUT:
            return EMPTY_USER;
        default:
            return state;
    }
}

/**
 * Handling loading state.
 *
 * Currently, this state is represented by a single boolean switch. The assumption is that there will always be one
 * component aware of the loading status and that one should display the loading mask.
 *
 * NOTE: This strategy is highly likely to change as we might have multiple components loading data independently of
 * each other
 */
function loading(state = false, action: AsyncAction): boolean {
    if (action.ignoreLoading) {
        return state;
    }
    switch (action.status) {
        case AsyncActionStatus.REQUEST:
            return true;
        case AsyncActionStatus.SUCCESS:
        case AsyncActionStatus.FAILURE:
            return false;
        default:
            return state;
    }
}

/**
 * Error status of the application.
 *
 * The store currently supports only one error, so if an error action is invoked, the previous error status is replaced
 * by the new one. The state holds structured information about the error itself and the action where the error
 * originated (usually an error action).
 */
function error(state: ErrorInfo = EMPTY_ERROR, action: Action): ErrorInfo {
    switch (action.type) {
        case ActionType.CLEAR_ERROR:
            const errAction = action as ClearErrorAction;
            return errAction.origin === state.origin ? EMPTY_ERROR : state;
        default:
            if ((action as FailureAction).error) {
                return (action as FailureAction).error;
            }
            return state;
    }
}

function messages(state: Message[] = [], action: MessageAction): Message[] {
    switch (action.type) {
        case ActionType.PUBLISH_MESSAGE:
            return [...state, action.message];
        case ActionType.DISMISS_MESSAGE:
            const newArr = state.slice(0);
            newArr.splice(newArr.indexOf(action.message), 1);
            return newArr;
        default:
            return state;
    }
}

function intl(state: IntlData = loadInitialLocalizationData(), action: SwitchLanguageAction): IntlData {
    switch (action.type) {
        case ActionType.SWITCH_LANGUAGE:
            return loadLocalizationData(action.language);
        default:
            return state;
    }
}

function vocabulary(state: Vocabulary = EMPTY_VOCABULARY, action: AsyncActionSuccess<Vocabulary>): Vocabulary {
    switch (action.type) {
        case ActionType.LOAD_VOCABULARY:
            return action.status === AsyncActionStatus.SUCCESS ? action.payload : state;
        default:
            return state;
    }
}

function resource(state: Resource = EMPTY_RESOURCE, action: AsyncActionSuccess<any>): Resource {
    switch (action.type) {
        case ActionType.LOAD_RESOURCE:
            return action.status === AsyncActionStatus.SUCCESS ? action.payload : state;
        case ActionType.LOAD_RESOURCE_TERMS:
            if (action.status === AsyncActionStatus.SUCCESS) {
                const r = new Resource(state);
                r.terms = action.payload;
                return r;
            } else {
                return state;
            }
        default:
            return state;
    }
}

function resources(state: { [key: string]: Resource } | any = {}, action: AsyncActionSuccess<Resource[]>): { [key: string]: Resource } {
    switch (action.type) {
        case ActionType.LOAD_RESOURCES:
            if (action.status === AsyncActionStatus.SUCCESS) {
                const map = {};
                action.payload.forEach(v =>
                    map[v.iri] = v
                );
                return map;
            } else {
                return state;
            }
        default:
            return state;
    }
}

function vocabularies(state: { [key: string]: Vocabulary } | any = {}, action: AsyncActionSuccess<Vocabulary[]>): { [key: string]: Vocabulary } {
    switch (action.type) {
        case ActionType.LOAD_VOCABULARIES:
            if (action.status === AsyncActionStatus.SUCCESS) {
                const map = {};
                action.payload.forEach(v =>
                    map[v.iri] = v
                );
                return map;
            } else {
                return state;
            }
        default:
            return state;
    }
}

function selectedTerm(state: Term | null = null, action: SelectingTermsAction | AsyncActionSuccess<Term>) {
    switch (action.type) {
        case ActionType.SELECT_VOCABULARY_TERM:
            return (action as SelectingTermsAction).selectedTerms;
        case ActionType.LOAD_TERM:
            const aa = action as AsyncActionSuccess<Term>;
            return aa.status === AsyncActionStatus.SUCCESS ? aa.payload : state;
        default:
            return state;
    }
}

function createdTermsCounter(state: number = 0, action: AsyncAction) {
    switch (action.type) {
        case ActionType.CREATE_VOCABULARY_TERM:
            return action.status === AsyncActionStatus.SUCCESS ? state + 1 : state;
        default:
            return state;
    }
}

function defaultTerms(state: Term[] = [], action: AsyncActionSuccess<Term[]>): Term[] {
    switch (action.type) {
        case ActionType.LOAD_DEFAULT_TERMS:
            return action.status === AsyncActionStatus.SUCCESS ? action.payload : state;
        default:
            return state;
    }
}

function queryResults(state: { [key: string]: QueryResultIF } = {}, action: ExecuteQueryAction) {
    switch (action.type) {
        case ActionType.EXECUTE_QUERY:
            if (action.status === AsyncActionStatus.SUCCESS) {
                return {
                    ...state,
                    [action.queryString]: new QueryResult(action.queryString, action.queryResult)
                };
            } else {
                return state;
            }
        default:
            return state;
    }
}

function facetedSearchResult(state: object = {}, action: FacetedSearchAction) {
    switch (action.type) {
        case ActionType.FACETED_SEARCH:
            return (action.status === AsyncActionStatus.SUCCESS) ? action.payload : state;
        default:
            return state;
    }
}

function fileContent(state: string | null = null, action: AsyncActionSuccess<string>): string | null {
    switch (action.type) {
        case ActionType.LOAD_FILE_CONTENT:
            return action.status === AsyncActionStatus.SUCCESS ? action.payload : state;
        case ActionType.SAVE_FILE_CONTENT:
            return state; // TODD not updating file content for now
        default:
            return state;
    }
}

function document(state: Document = EMPTY_DOCUMENT, action: AsyncActionSuccess<Document>): Document {
    switch (action.type) {
        case ActionType.LOAD_DOCUMENT:
            return action.status === AsyncActionStatus.SUCCESS ? action.payload : state;
        default:
            return state;
    }
}

function types(state: { [key: string]: Term } | any = {}, action: AsyncActionSuccess<Term[]>): { [key: string]: Term } {
    switch (action.type) {
        case ActionType.LOAD_TYPES:
            if (action.status === AsyncActionStatus.SUCCESS) {
                const map = {};
                action.payload.forEach(v =>
                    map[v.iri] = v
                );
                return map;
            } else {
                return state;
            }
        default:
            return state;
    }
}

function properties(state: RdfsResource[] = [], action: AsyncActionSuccess<RdfsResource[]> | Action): RdfsResource[] {
    switch (action.type) {
        case ActionType.GET_PROPERTIES:
            const asyncAction = action as AsyncActionSuccess<RdfsResource[]>;
            return asyncAction.status === AsyncActionStatus.SUCCESS ? asyncAction.payload : state;
        case ActionType.CLEAR_PROPERTIES:
            return [];
        default:
            return state;
    }
}

function notifications(state: AppNotification[] = [], action: NotificationAction) {
    switch (action.type) {
        case ActionType.PUBLISH_NOTIFICATION:
            return [...state, action.notification];
        case ActionType.CONSUME_NOTIFICATION:
            const index = state.indexOf(action.notification);
            if (index >= 0) {
                const newState = state.slice();
                newState.splice(index, 1);
                return newState;
            }
            return state;
        default:
            return state;
    }
}

const rootReducer = combineReducers<TermItState>({
    user,
    loading,
    vocabulary,
    vocabularies,
    resource,
    resources,
    error,
    messages,
    intl,
    selectedTerm,
    defaultTerms,
    queryResults,
    createdTermsCounter,
    document,
    fileContent,
    facetedSearchResult,
    types,
    properties,
    notifications
});

export default rootReducer;