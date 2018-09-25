import ErrorInfo from "../model/ErrorInfo";
import User from "../model/User";
import Message from "../model/Message";
import AsyncActionStatus from "./AsyncActionStatus";
import Vocabulary from "../model/Vocabulary";
import VocabularyTerm from "../model/VocabularyTerm";
import SearchResult from "../model/SearchResult";

export interface Action {
    type: string
}

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

export interface ClearErrorAction extends Action {
    origin: string
}

export interface MessageAction extends Action {
    message: Message
}

export interface SwitchLanguageAction extends Action {
    language: string
}

export interface VocabularyLoadingAction extends AsyncAction {
    vocabulary: Vocabulary
}

export interface SelectingTermsAction extends Action {
    selectedTerms: VocabularyTerm | null
}

export interface LoadDefaultTermsAction extends Action {
    options: VocabularyTerm[]
}

export interface VocabulariesLoadingAction extends AsyncAction {
    vocabularies: Vocabulary[]
}

export interface ExecuteQueryAction extends AsyncAction {
    queryString: string,
    queryResult: object
}

export interface SearchAction extends AsyncAction {
    results: SearchResult[];
}

export default {
    FETCH_USER_REQUEST: 'FETCH_USER_REQUEST',
    FETCH_USER_FAILURE: 'FETCH_USER_FAILURE',
    FETCH_USER_SUCCESS: 'FETCH_USER_SUCCESS',

    LOGIN_REQUEST: 'LOGIN_REQUEST',
    LOGIN_FAILURE: 'LOGIN_REQUEST_FAILURE',
    LOGIN_SUCCESS: 'LOGIN_REQUEST_SUCCESS',

    REGISTER_REQUEST: 'REGISTER_REQUEST',
    REGISTER_FAILURE: 'REGISTER_FAILURE',
    REGISTER_SUCCESS: 'REGISTER_SUCCESS',

    CLEAR_ERROR: 'CLEAR_ERROR',

    PUBLISH_MESSAGE: 'PUBLISH_MESSAGE',
    DISMISS_MESSAGE: 'DISMISS_MESSAGE',

    SWITCH_LANGUAGE: 'SWITCH_LANGUAGE',

    CREATE_VOCABULARY_REQUEST: 'CREATE_VOCABULARY_REQUEST',
    CREATE_VOCABULARY_SUCCESS: 'CREATE_VOCABULARY_SUCCESS',
    CREATE_VOCABULARY_FAILURE: 'CREATE_VOCABULARY_FAILURE',

    LOAD_VOCABULARY_REQUEST: 'LOAD_VOCABULARY_REQUEST',
    LOAD_VOCABULARY_SUCCESS: 'LOAD_VOCABULARY_SUCCESS',
    LOAD_VOCABULARY_FAILURE: 'LOAD_VOCABULARY_FAILURE',

    SELECT_VOCABULARY_TERM: 'SELECT_VOCABULARY_TERM',

    LOAD_VOCABULARIES_REQUEST: 'LOAD_VOCABULARIES_REQUEST',
    LOAD_VOCABULARIES_SUCCESS: 'LOAD_VOCABULARIES_SUCCESS',
    LOAD_VOCABULARIES_FAILURE: 'LOAD_VOCABULARIES_FAILURE',

    EXECUTE_QUERY_REQUEST: 'EXECUTE_QUERY_REQUEST',
    EXECUTE_QUERY_SUCCESS: 'EXECUTE_QUERY_SUCCESS',
    EXECUTE_QUERY_FAILURE: 'EXECUTE_QUERY_FAILURE',

    CREATE_VOCABULARY_TERM_REQUEST: 'CREATE_VOCABULARY_TERM_REQUEST',
    CREATE_VOCABULARY_TERM_SUCCESS: 'CREATE_VOCABULARY_TERM_SUCCESS',
    CREATE_VOCABULARY_TERM_FAILURE: 'CREATE_VOCABULARY_TERM_FAILURE',

    FETCH_VOCABULARY_TERMS_REQUEST: 'FETCH_VOCABULARY_TERM_REQUEST',
    FETCH_VOCABULARY_TERMS_FAILURE: 'FETCH_VOCABULARY_TERMS_FAILURE',

    LOAD_DEFAULT_TERMS: 'LOAD_DEFAULT_TERMS',

    SEARCH: 'SEARCH',
    CLEAR_SEARCH_RESULTS: 'CLEAR_SEARCH_RESULTS',

    LOGOUT: 'LOGOUT'
}