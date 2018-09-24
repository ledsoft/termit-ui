import ActionType, {
    Action,
    AsyncAction,
    AsyncFailureAction,
    SearchAction,
    ClearErrorAction,
    ExecuteQueryAction,
    LoadDefaultTermsAction,
    MessageAction,
    SelectingTermsAction,
    SwitchLanguageAction,
    UserLoadingAction,
    VocabulariesLoadingAction,
    VocabularyLoadingAction
} from './ActionType';
import ErrorInfo, {ErrorData} from "../model/ErrorInfo";
import User, {UserData} from "../model/User";
import Message from "../model/Message";
import AsyncActionStatus from "./AsyncActionStatus";
import Vocabulary, {VocabularyData} from "../model/Vocabulary";
import {saveLanguagePreference} from "../util/IntlUtil";
import VocabularyTerm, {VocabularyTermData} from "../model/VocabularyTerm";
import SearchResult, {SearchResultData} from "../model/SearchResult";

/*
 * The most basic Redux actions. Each function exported from here returns an action object which is directly dispatched by Redux.
 */

export function asyncActionRequest(a: Action, ignoreLoading: boolean = false): AsyncAction {
    return {...a, status: AsyncActionStatus.REQUEST, ignoreLoading};
}

export function asyncActionFailure(a: Action, error: ErrorData): AsyncFailureAction {
    return {...a, status: AsyncActionStatus.FAILURE, error: new ErrorInfo(a.type, error)};
}

export function fetchUserRequest(): AsyncAction {
    return asyncActionRequest({
        type: ActionType.FETCH_USER_REQUEST
    });
}

export function fetchUserSuccess(data: UserData): UserLoadingAction {
    return {
        type: ActionType.FETCH_USER_SUCCESS,
        status: AsyncActionStatus.SUCCESS,
        user: new User(data)
    };
}

export function fetchUserFailure(error: ErrorData): AsyncFailureAction {
    return asyncActionFailure({
        type: ActionType.FETCH_USER_FAILURE,
    }, error);
}

export function loginRequest(): AsyncAction {
    return asyncActionRequest({
        type: ActionType.LOGIN_REQUEST
    });
}

export function loginSuccess(): AsyncAction {
    return {
        type: ActionType.LOGIN_SUCCESS,
        status: AsyncActionStatus.SUCCESS
    };
}

export function loginFailure(error: ErrorData): AsyncFailureAction {
    return asyncActionFailure({
        type: ActionType.LOGIN_FAILURE
    }, error);
}

export function clearError(origin: string): ClearErrorAction {
    return {
        type: ActionType.CLEAR_ERROR,
        origin
    };
}

export function publishMessage(message: Message): MessageAction {
    return {
        type: ActionType.PUBLISH_MESSAGE,
        message
    };
}

export function dismissMessage(message: Message): MessageAction {
    return {
        type: ActionType.DISMISS_MESSAGE,
        message
    };
}

export function switchLanguage(language: string): SwitchLanguageAction {
    saveLanguagePreference(language);
    return {
        type: ActionType.SWITCH_LANGUAGE,
        language
    };
}

export function registerRequest(): AsyncAction {
    return asyncActionRequest({
        type: ActionType.REGISTER_REQUEST
    });
}

export function registerFailure(error: ErrorData): AsyncFailureAction {
    return asyncActionFailure({
        type: ActionType.REGISTER_FAILURE,
    }, error);
}

export function registerSuccess(): AsyncAction {
    return {
        type: ActionType.REGISTER_SUCCESS,
        status: AsyncActionStatus.SUCCESS
    };
}

export function userLogout(): Action {
    return {
        type: ActionType.LOGOUT
    };
}

export function createVocabularyRequest(): AsyncAction {
    return asyncActionRequest({
        type: ActionType.CREATE_VOCABULARY_REQUEST
    });
}

export function createVocabularyTermRequest(): AsyncAction {
    return asyncActionRequest({
        type: ActionType.CREATE_VOCABULARY_TERM_REQUEST
    })
}

export function createVocabularyTermFailure(error: ErrorData): AsyncFailureAction {
    return asyncActionFailure({
        type: ActionType.CREATE_VOCABULARY_TERM_FAILURE,
    }, error);
}

export function createVocabularyTermSuccess(): AsyncAction {
    return {
        type: ActionType.CREATE_VOCABULARY_TERM_SUCCESS,
        status: AsyncActionStatus.SUCCESS
    };
}

export function createVocabularyFailure(error: ErrorData): AsyncFailureAction {
    return asyncActionFailure({
        type: ActionType.CREATE_VOCABULARY_FAILURE,
    }, error);
}

export function createVocabularySuccess(): AsyncAction {
    return {
        type: ActionType.CREATE_VOCABULARY_SUCCESS,
        status: AsyncActionStatus.SUCCESS
    };
}

export function loadVocabularyRequest(): AsyncAction {
    return asyncActionRequest({
        type: ActionType.LOAD_VOCABULARY_REQUEST
    });
}

export function loadVocabularySuccess(data: VocabularyData): VocabularyLoadingAction {
    return {
        type: ActionType.LOAD_VOCABULARY_SUCCESS,
        status: AsyncActionStatus.SUCCESS,
        vocabulary: new Vocabulary(data)
    }
}

export function loadVocabularyFailure(error: ErrorData): AsyncFailureAction {
    return asyncActionFailure({
        type: ActionType.LOAD_VOCABULARY_FAILURE
    }, error);
}

export function loadVocabulariesRequest(): AsyncAction {
    return asyncActionRequest({
        type: ActionType.LOAD_VOCABULARIES_REQUEST
    });
}

export function loadVocabulariesSuccess(data: VocabularyData[]): VocabulariesLoadingAction {
    return {
        type: ActionType.LOAD_VOCABULARIES_SUCCESS,
        status: AsyncActionStatus.SUCCESS,
        vocabularies: data ? data.map(v => new Vocabulary(v)) : []
    }
}

export function loadVocabulariesFailure(error: ErrorData): AsyncFailureAction {
    return asyncActionFailure({
        type: ActionType.LOAD_VOCABULARIES_FAILURE
    }, error);
}

export function executeQueryRequest(): AsyncAction {
    return asyncActionRequest({
        type: ActionType.EXECUTE_QUERY_REQUEST
    });
}

export function executeQuerySuccess(queryString: string, result: object): ExecuteQueryAction {
    return {
        type: ActionType.EXECUTE_QUERY_SUCCESS,
        status: AsyncActionStatus.SUCCESS,
        queryResult: result,
        queryString
    }
}

export function executeQueryFailure(error: ErrorData): AsyncFailureAction {
    return asyncActionFailure({
        type: ActionType.EXECUTE_QUERY_FAILURE
    }, error);
}

export function selectVocabularyTerm(data: VocabularyTermData | null): SelectingTermsAction {
    return{
        type: ActionType.SELECT_VOCABULARY_TERM,
        selectedTerms: data? new VocabularyTerm(data): data,
    }
}

export function fetchVocabularyTermsRequest(): AsyncAction {
    return asyncActionRequest({
        type: ActionType.FETCH_VOCABULARY_TERMS_REQUEST,
    }, true);
}

export function fetchVocabularyTermsFailure(error: ErrorData): AsyncFailureAction {
    return asyncActionFailure({
        type: ActionType.FETCH_VOCABULARY_TERMS_FAILURE
    }, error);
}

export function loadDefaultTerms(data: VocabularyTermData[]): LoadDefaultTermsAction {
    return {
        type: ActionType.LOAD_DEFAULT_TERMS,
        options: data.map((term: VocabularyTermData) => new VocabularyTerm(term))
    }
}
export function searchSuccess(results: SearchResultData[]): SearchAction {
    return {
        type: ActionType.SEARCH,
        status: AsyncActionStatus.SUCCESS,
        results: results.map(r => new SearchResult(r))
    };
}
