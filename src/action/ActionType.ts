import ErrorInfo from "../model/ErrorInfo";
import Message from "../model/Message";
import AsyncActionStatus from "./AsyncActionStatus";
import Term from "../model/Term";
import {Action} from "redux";

export interface AsyncAction extends Action {
    status: AsyncActionStatus;
    ignoreLoading?: boolean;    // Allows to prevent loading spinner display on async action
}

export interface FailureAction extends Action {
    error: ErrorInfo
}

export interface AsyncFailureAction extends AsyncAction, FailureAction {
}

export interface AsyncActionSuccess<T> extends AsyncAction {
    payload: T;
}

export interface ClearErrorAction extends Action {
    origin: string
}

export interface MessageAction extends Action {
    message: Message
}

export interface SwitchLanguageAction extends Action {
    language: string
}

export interface SelectingTermsAction extends Action {
    selectedTerms: Term | null
}

export interface ExecuteQueryAction extends AsyncAction {
    queryString: string,
    queryResult: object
}

export interface FacetedSearchAction extends AsyncAction {
    payload: object
}

export interface FileSelectingAction extends Action {
    fileIri: string | null
}

export interface SearchAction extends Action {
    searchString: string
}

export default {
    FETCH_USER: 'FETCH_USER',
    LOGIN: 'LOGIN',
    REGISTER: 'REGISTER',
    LOGOUT: 'LOGOUT',

    CLEAR_ERROR: 'CLEAR_ERROR',
    PUBLISH_MESSAGE: 'PUBLISH_MESSAGE',
    DISMISS_MESSAGE: 'DISMISS_MESSAGE',
    SWITCH_LANGUAGE: 'SWITCH_LANGUAGE',

    CREATE_VOCABULARY: 'CREATE_VOCABULARY',
    LOAD_VOCABULARY: 'LOAD_VOCABULARY',
    SELECT_VOCABULARY_TERM: 'SELECT_VOCABULARY_TERM',
    LOAD_VOCABULARIES: 'LOAD_VOCABULARIES',
    UPDATE_VOCABULARY: 'UPDATE_VOCABULARY',

    CREATE_VOCABULARY_TERM: 'CREATE_VOCABULARY_TERM',
    FETCH_VOCABULARY_TERMS: 'FETCH_VOCABULARY_TERMS',
    LOAD_DEFAULT_TERMS: 'LOAD_DEFAULT_TERMS',
    UPDATE_TERM: 'UPDATE_TERM',

    LOAD_TYPES: 'LOAD_TYPES',

    EXECUTE_QUERY: 'EXECUTE_QUERY',
    FACETED_SEARCH: 'FACETED_SEARCH',
    SEARCH: 'SEARCH',
    UPDATE_SEARCH_FILTER: 'UPDATE_SEARCH_FILTER',

    LOAD_DOCUMENT: 'LOAD_DOCUMENT',
    SELECT_FILE: 'SELECT_FILE',
    LOAD_FILE_CONTENT: 'LOAD_FILE_CONTENT',

    START_FILE_TEXT_ANALYSIS: 'START_FILE_TEXT_ANALYSIS',
}
