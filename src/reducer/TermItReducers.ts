import {combineReducers} from "redux";
import ActionType, {
    Action,
    AsyncAction,
    ClearErrorAction,
    ExecuteQueryAction,
    FailureAction,
    MessageAction,
    SearchAction,
    SelectingTermsAction,
    LoadDefaultTermsAction,
    SwitchLanguageAction,
    UserLoadingAction,
    VocabulariesLoadingAction,
    VocabularyLoadingAction
} from '../action/ActionType';
import TermItState from "../model/TermItState";
import User, {EMPTY_USER} from "../model/User";
import ErrorInfo, {EMPTY_ERROR} from "../model/ErrorInfo";
import Message from "../model/Message";
import IntlData from "../model/IntlData";
import {loadInitialLocalizationData, loadLocalizationData} from "../util/IntlUtil";
import AsyncActionStatus from "../action/AsyncActionStatus";
import Vocabulary, {EMPTY_VOCABULARY} from "../model/Vocabulary";
import {default as QueryResult, QueryResultIF} from "../model/QueryResult";
import SearchResult from "../model/SearchResult";
import VocabularyTerm from "../model/VocabularyTerm";

/**
 * Handles changes to the currently logged in user.
 *
 * The initial state is an empty user, which basically shouldn't be allowed to do anything.
 */
function user(state: User = EMPTY_USER, action: UserLoadingAction): User {
    switch (action.type) {
        case ActionType.FETCH_USER_SUCCESS:
            return action.user;
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
        case ActionType.FETCH_USER_FAILURE:
        case ActionType.LOGIN_FAILURE:
        case ActionType.REGISTER_FAILURE:
        case ActionType.CREATE_VOCABULARY_FAILURE:
        case ActionType.CREATE_VOCABULARY_TERM_FAILURE:
        case ActionType.LOAD_VOCABULARY_FAILURE:
            return (action as FailureAction).error;
        case ActionType.CLEAR_ERROR:
            const errAction = action as ClearErrorAction;
            return errAction.origin === state.origin ? EMPTY_ERROR : state;
        default:
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

function vocabulary(state: Vocabulary = EMPTY_VOCABULARY, action: VocabularyLoadingAction): Vocabulary {
    switch (action.type) {
        case ActionType.LOAD_VOCABULARY_SUCCESS:
            return action.vocabulary;
        default:
            return state;
    }
}

function vocabularies(state: {[key:string]:Vocabulary}|any = {}, action: VocabulariesLoadingAction): {[key:string]:Vocabulary} {
    switch (action.type) {
        case ActionType.LOAD_VOCABULARIES_SUCCESS:
            const map = {};
            action.vocabularies.forEach(v =>
                map[v.iri] = v
            );
            return map;
        default:
            return state;
    }
}

function selectedTerm(state: VocabularyTerm | null = null, action: SelectingTermsAction) {
    switch (action.type) {
        case ActionType.SELECT_VOCABULARY_TERM:
            return action.selectedTerms;
        default:
            return state;
    }
}

function defaultTerms(state: VocabularyTerm[] = [], action: LoadDefaultTermsAction) {
    switch (action.type) {
        case ActionType.LOAD_DEFAULT_TERMS:
            return action.options;
        default:
            return state;
    }
}

function queryResults(state: { [key: string]: QueryResultIF } = {}, action: ExecuteQueryAction) {
    switch (action.type) {
        case ActionType.EXECUTE_QUERY_SUCCESS:
            return {...state,
                [action.queryString] :  new QueryResult(action.queryString,action.queryResult)};
        default:
            return state;
    }
}

function searchResults(state: SearchResult[] | null = null, action: SearchAction) {
    switch (action.type) {
        case ActionType.SEARCH:
            if (action.status === AsyncActionStatus.SUCCESS) {
                return action.results;
            } else {
                return state;
            }
        case ActionType.CLEAR_SEARCH_RESULTS:
            return null;
        default:
            return state;
    }
}

const rootReducer = combineReducers<TermItState>({
    user,
    loading,
    vocabulary,
    vocabularies,
    error,
    messages,
    intl,
    selectedTerm,
    defaultTerms,
    queryResults,
    searchResults
});

export default rootReducer;