import ErrorInfo from "../model/ErrorInfo";
import User from "../model/User";
import Message from "../model/Message";
import AsyncActionStatus from "./AsyncActionStatus";
import VocabularyTerm from "../model/VocabularyTerm";
import {Action} from "redux";

export interface AsyncAction extends Action {
    status: AsyncActionStatus;
    ignoreLoading?: boolean;    // Allows to prevent loading spinner display on async action
}

export interface UserLoadingAction extends AsyncAction {
    user: User
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
    selectedTerms: VocabularyTerm | null
}

export interface ExecuteQueryAction extends AsyncAction {
    queryString: string,
    queryResult: object
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

    CREATE_VOCABULARY_TERM: 'CREATE_VOCABULARY_TERM',
    FETCH_VOCABULARY_TERMS: 'FETCH_VOCABULARY_TERMS',
    LOAD_DEFAULT_TERMS: 'LOAD_DEFAULT_TERMS',

    EXECUTE_QUERY: 'EXECUTE_QUERY',
    SEARCH: 'SEARCH',

    LOAD_DOCUMENT: 'LOAD_DOCUMENT',
    SELECT_FILE: 'SELECT_FILE',
    LOAD_FILE_CONTENT: 'LOAD_FILE_CONTENT'
}