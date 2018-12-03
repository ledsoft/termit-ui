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
    LOAD_TERM: 'LOAD_TERM',
    UPDATE_TERM: 'UPDATE_TERM',
    LOAD_TERM_ASSIGNMENTS: "LOAD_TERM_ASSIGNMENTS",

    LOAD_TYPES: 'LOAD_TYPES',

    EXECUTE_QUERY: 'EXECUTE_QUERY',
    FACETED_SEARCH: 'FACETED_SEARCH',
    SEARCH: 'SEARCH',

    LOAD_DOCUMENT: 'LOAD_DOCUMENT',
    SELECT_FILE: 'SELECT_FILE',
    LOAD_FILE_CONTENT: 'LOAD_FILE_CONTENT',

    LOAD_RESOURCE: 'LOAD_RESOURCE',
    LOAD_RESOURCES: 'LOAD_RESOURCES',
    LOAD_RESOURCE_TERMS: 'LOAD_RESOURCE_TERMS',
    UPDATE_RESOURCE: 'UPDATE_RESOURCE',

    START_FILE_TEXT_ANALYSIS: 'START_FILE_TEXT_ANALYSIS',

    GET_LABEL: 'GET_LABEL',
    GET_PROPERTIES: "GET_PROPERTIES",
    CREATE_PROPERTY: "CREATE_PROPERTY",
    CLEAR_PROPERTIES: "CLEAR_PROPERTIES",

    EXPORT_GLOSSARY_CSV: "EXPORT_GLOSSARY_CSV"
}