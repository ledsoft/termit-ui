import * as SyncActions from './SyncActions';
import {asyncActionFailure, asyncActionRequest, asyncActionSuccess, asyncActionSuccessWithPayload} from './SyncActions';
import Ajax, {content, params} from '../util/Ajax';
import {ThunkDispatch} from '../util/Types';
import Routing from '../util/Routing';
import Constants from '../util/Constants';
import User, {CONTEXT as USER_CONTEXT, UserData} from '../model/User';
import Vocabulary, {CONTEXT as VOCABULARY_CONTEXT, VocabularyData} from "../model/Vocabulary";
import Routes from "../util/Routes";
import IdentifierResolver from "../util/IdentifierResolver";
import {ErrorData} from "../model/ErrorInfo";
import {AxiosResponse} from "axios";
import * as jsonld from "jsonld";
import Message, {createFormattedMessage} from "../model/Message";
import MessageType from "../model/MessageType";
import VocabularyTerm, {CONTEXT as TERM_CONTEXT, VocabularyTermData} from "../model/VocabularyTerm";
import FetchOptionsFunction from "../model/Functions";
import {IRI} from "../util/VocabularyUtils";
import ActionType from "./ActionType";
import SearchResult, {CONTEXT as SEARCH_RESULT_CONTEXT, SearchResultData} from "../model/SearchResult";
import Document, {CONTEXT as DOCUMENT_CONTEXT, DocumentData} from "../model/Document";

/*
 * Asynchronous actions involve requests to the backend server REST API. As per recommendations in the Redux docs, this consists
 * of several synchronous sub-actions which inform the application of initiation of the request and its result.
 */

export function fetchUser() {
    const action = {
        type: ActionType.FETCH_USER
    };
    return (dispatch: ThunkDispatch) => {
        dispatch(asyncActionRequest(action));
        return Ajax.get(Constants.API_PREFIX + '/users/current')
            .then((data: object) => jsonld.compact(data, USER_CONTEXT))
            .then((data: UserData) => dispatch(asyncActionSuccessWithPayload(action, new User(data))))
            .catch((error: ErrorData) => {
                if (error.status === Constants.STATUS_UNAUTHORIZED) {
                    return dispatch(asyncActionFailure(action, error));
                } else {
                    dispatch(asyncActionFailure(action, error));
                    return dispatch(SyncActions.publishMessage(new Message(error, MessageType.ERROR)));
                }
            });
    };
}

export function login(username: string, password: string) {
    const action = {
        type: ActionType.LOGIN
    };
    return (dispatch: ThunkDispatch) => {
        dispatch(asyncActionRequest(action));
        return Ajax.post('/j_spring_security_check', params({
            username,
            password
        }).contentType(Constants.X_WWW_FORM_URLENCODED))
            .then((resp: AxiosResponse) => {
                const data = resp.data;
                if (!data.loggedIn) {
                    return Promise.reject(data);
                } else {
                    Routing.transitionToHome();
                    dispatch(asyncActionSuccess(action));
                    return Promise.resolve();
                }
            })
            .then(() => dispatch(SyncActions.publishMessage(createFormattedMessage('message.welcome'))))
            .catch((error: ErrorData) => dispatch(asyncActionFailure(action, error)));
    };
}

export function register(user: { username: string, password: string }) {
    const action = {
        type: ActionType.REGISTER
    };
    return (dispatch: ThunkDispatch) => {
        dispatch(asyncActionRequest(action));
        return Ajax.post(Constants.API_PREFIX + '/users', content(user).contentType('application/json'))
            .then(() => dispatch(asyncActionSuccess(action)))
            .then(() => dispatch(login(user.username, user.password)))
            .catch((error: ErrorData) => dispatch(asyncActionFailure(action, error)));
    };
}

export function createVocabulary(vocabulary: Vocabulary) {
    const action = {
        type: ActionType.CREATE_VOCABULARY
    };
    return (dispatch: ThunkDispatch) => {
        dispatch(asyncActionRequest(action));
        return Ajax.post(Constants.API_PREFIX + '/vocabularies', content(vocabulary.toJsonLd()))
            .then((resp: AxiosResponse) => {
                dispatch(asyncActionSuccess(action));
                const location = resp.headers[Constants.LOCATION_HEADER];
                Routing.transitionTo(Routes.vocabularyDetail, IdentifierResolver.routingOptionsFromLocation(location));
                return dispatch(SyncActions.publishMessage(new Message({messageId: 'vocabulary.created.message'}, MessageType.SUCCESS)));
            })
            .catch((error: ErrorData) => {
                dispatch(asyncActionFailure(action, error));
                return dispatch(SyncActions.publishMessage(new Message(error, MessageType.ERROR)));
            });
    };
}

export function createVocabularyTerm(term: VocabularyTerm, normalizedName: string) {
    const action = {
        type: ActionType.CREATE_VOCABULARY_TERM
    };
    return (dispatch: ThunkDispatch) => {
        dispatch(asyncActionRequest(action));
        return Ajax.post(Constants.API_PREFIX + '/vocabularies/' + normalizedName + '/terms',
            content(term.toJsonLd()).params({parentTermUri: term.parent}).contentType(Constants.JSON_LD_MIME_TYPE))
            .then((resp: AxiosResponse) => {
                dispatch(asyncActionSuccess(action));
                const location = resp.headers[Constants.LOCATION_HEADER];
                Routing.transitionTo(Routes.vocabularyDetail, IdentifierResolver.routingOptionsFromLocation(location));
                return dispatch(SyncActions.publishMessage(new Message({messageId: 'vocabulary.term.created.message'}, MessageType.SUCCESS)));
            })
            .catch((error: ErrorData) => {
                dispatch(asyncActionFailure(action, error));
                return dispatch(SyncActions.publishMessage(new Message(error, MessageType.ERROR)));
            });
    };
}

export function loadVocabulary(iri: IRI) {
    const action = {
        type: ActionType.LOAD_VOCABULARY
    };
    return (dispatch: ThunkDispatch) => {
        dispatch(asyncActionRequest(action));
        return Ajax
            .get(Constants.API_PREFIX + '/vocabularies/' + iri.fragment + (iri.namespace ? "?query=" + iri.namespace : ""))
            .then((data: object) =>
                jsonld.compact(data, VOCABULARY_CONTEXT))
            .then((data: VocabularyData) =>
                dispatch(asyncActionSuccessWithPayload(action, new Vocabulary(data))))
            .catch((error: ErrorData) => {
                dispatch(asyncActionFailure(action, error));
                return dispatch(SyncActions.publishMessage(new Message(error, MessageType.ERROR)));
            });
    };
}

export function loadVocabularies() {
    const action = {
        type: ActionType.LOAD_VOCABULARIES
    };
    return (dispatch: ThunkDispatch) => {
        dispatch(asyncActionRequest(action));
        return Ajax.get(Constants.API_PREFIX + '/vocabularies')
            .then((data: object[]) =>
                data.length !== 0 ? jsonld.compact(data, VOCABULARY_CONTEXT) : [])
            .then((compacted: object) => loadArrayFromCompactedGraph(compacted))
            .then((data: VocabularyData[]) =>
                dispatch(asyncActionSuccessWithPayload(action, data.map(v => new Vocabulary(v)))))
            .catch((error: ErrorData) => {
                dispatch(asyncActionFailure(action, error));
                return dispatch(SyncActions.publishMessage(new Message(error, MessageType.ERROR)));
            });
    };
}

export function loadTerms(normalizedName: string) {
    const action = {
        type: ActionType.LOAD_DEFAULT_TERMS
    };
    return (dispatch: ThunkDispatch) => {
        dispatch(asyncActionRequest(action, true));
        return Ajax.get(Constants.API_PREFIX + '/vocabularies/' + normalizedName + '/terms/find',
            params({
                limit: 100,
                offset: 0
            }))
            .then((data: object[]) =>
                data.length !== 0 ? jsonld.compact(data, TERM_CONTEXT) : [])
            .then((compacted: object) => loadArrayFromCompactedGraph(compacted))
            .then((data: VocabularyTerm[]) => dispatch(asyncActionSuccessWithPayload(action, data.map(vt => new VocabularyTerm(vt)))))
            .catch((error: ErrorData) => {
                // TODO JL This swallows the error without any notification/action whatsoever!!!
                return dispatch(dispatch(asyncActionSuccessWithPayload(action, [])))
            });
    };
}

// TODO JL What is the effective difference between loadTerms and fetchVocabularyTerms?
export function fetchVocabularyTerms(fetchOptions: FetchOptionsFunction, normalizedName: string) {
    const action = {
        type: ActionType.FETCH_VOCABULARY_TERMS
    };
    return (dispatch: ThunkDispatch) => {
        dispatch(asyncActionRequest(action, true));
        return Ajax.get(Constants.API_PREFIX + '/vocabularies/' + normalizedName + '/terms/find',
            params({
                label: fetchOptions.searchString,
                parentTerm: fetchOptions.optionID,
                limit: fetchOptions.limit,
                offset: fetchOptions.offset
            }))
            .then((data: object[]) =>
                data.length !== 0 ? jsonld.compact(data, TERM_CONTEXT) : [])
            .then((compacted: object) => loadArrayFromCompactedGraph(compacted))
            .then((data: VocabularyTermData[]) => {
                    data.forEach((term: VocabularyTerm) => {
                        if (term.subTerms) {
                            // @ts-ignore
                            term.subTerms = Array.isArray(term.subTerms) ? term.subTerms.map(subTerm => subTerm.iri) : [term.subTerms.iri];
                        }
                    });
                    return data;
                }
            )
            .catch((error: ErrorData) => {
                dispatch(asyncActionFailure(action, error));
                return [];
            });
    };
}

export function fetchVocabularySubTerms(parentTermId: string, normalizedName: string) {
    const action = {
        type: ActionType.FETCH_VOCABULARY_TERMS
    };
    return (dispatch: ThunkDispatch) => {
        dispatch(asyncActionRequest(action, true));
        return Ajax.get(Constants.API_PREFIX + '/vocabularies/' + normalizedName + '/terms/subterms',
            params({parent_id: parentTermId}))
            .then((data: object[]) => data.length !== 0 ? jsonld.compact(data, TERM_CONTEXT) : [])
            .then((compacted: object) => loadArrayFromCompactedGraph(compacted))
            .then((data: VocabularyTermData[]) => data)
            .catch((error: ErrorData) => {
                dispatch(asyncActionFailure(action, error));
                // TODO JL Why does this publish an error message and fetchVocabularyTerms does not?
                dispatch(SyncActions.publishMessage(new Message(error, MessageType.ERROR)));
                return []
            });
    };
}

export function getVocabularyTermByID(termID: string, normalizedName: string) {
    const action = {
        type: ActionType.FETCH_VOCABULARY_TERMS
    };
    return (dispatch: ThunkDispatch) => {
        dispatch(asyncActionRequest(action, true));
        return Ajax.get(Constants.API_PREFIX + '/vocabularies/' + normalizedName + '/terms/id',
            params({term_id: termID}))
            .then((data: object) => jsonld.compact(data, TERM_CONTEXT))
            .catch((error: ErrorData) => {
                dispatch(asyncActionFailure(action, error));
                dispatch(SyncActions.publishMessage(new Message(error, MessageType.ERROR)));
                return null
            });
    };
}

// TODO server return http code 406
// TODO JL What does this method do? I don't see any corresponding REST endpoint on the backend. Moreover, its
// functionality is virtually the same as getVocabularyTermByID, as normalized name is part of identifier
export function getVocabularyTermByName(termNormalizedName: string, vocabularyNormalizedName: string) {
    const action = {
        type: ActionType.FETCH_VOCABULARY_TERMS
    };
    return (dispatch: ThunkDispatch) => {
        dispatch(asyncActionRequest(action, true));
        return Ajax.get(Constants.API_PREFIX + '/vocabularies/' + vocabularyNormalizedName + '/terms/' + termNormalizedName)
            .then((data: object) => jsonld.compact(data, TERM_CONTEXT))
            .catch((error: ErrorData) => {
                dispatch(asyncActionFailure(action, error));
                dispatch(SyncActions.publishMessage(new Message(error, MessageType.ERROR)));
                return null
            });
    };
}


export function executeQuery(queryString: string) {
    const action = {
        type: ActionType.EXECUTE_QUERY
    };
    return (dispatch: ThunkDispatch) => {
        dispatch(asyncActionRequest(action));
        return Ajax
            .get(Constants.API_PREFIX + '/query', params({queryString: encodeURI(queryString)}))
            .then((data: object) =>
                jsonld.compact(data, VOCABULARY_CONTEXT))
            .then((data: object) =>
                dispatch(SyncActions.executeQuerySuccess(queryString, data)))
            .catch((error: ErrorData) => {
                dispatch(asyncActionFailure(action, error));
                return dispatch(SyncActions.publishMessage(new Message(error, MessageType.ERROR)));
            });
    };
}

export function search(searchString: string, disableLoading: boolean = false) {
    const action = {
        type: ActionType.SEARCH
    };
    return (dispatch: ThunkDispatch) => {
        dispatch(asyncActionRequest(action, disableLoading));
        return Ajax.get(Constants.API_PREFIX + '/search/label', params({searchString: encodeURI(searchString)}))
            .then((data: object[]) => data.length > 0 ? jsonld.compact(data, SEARCH_RESULT_CONTEXT) : [])
            .then((compacted: object) => loadArrayFromCompactedGraph(compacted))
            .then((data: SearchResultData[]) => {
                dispatch(asyncActionSuccess(action));
                return data.map(d => new SearchResult(d));
            }).catch((error: ErrorData) => {
                dispatch(asyncActionFailure(action, error));
                return dispatch(SyncActions.publishMessage(new Message(error, MessageType.ERROR)));
            });
    };
}

function loadArrayFromCompactedGraph(compacted: object): object[] {
    if (!compacted.hasOwnProperty('@context')) {
        return []
    }
    return compacted.hasOwnProperty('@graph') ? Object.keys(compacted['@graph']).map(k => compacted['@graph'][k]) : [compacted]
}

export function loadFileContent(documentIri: IRI, fileName: string) {
    const action = {
        type: ActionType.LOAD_FILE_CONTENT
    };
    return (dispatch: ThunkDispatch) => {
        dispatch(asyncActionRequest(action));
        return Ajax
            .get(Constants.API_PREFIX + '/documents/' + documentIri.fragment + "/content", params({
                file: fileName,
                namespace: documentIri.namespace
            }))
            .then((data: object) => data.toString())
            .then((data: string) => dispatch(asyncActionSuccessWithPayload(action, data)))
            .catch((error: ErrorData) => {
                dispatch(asyncActionFailure(action, error));
                return dispatch(SyncActions.publishMessage(new Message(error, MessageType.ERROR)));
            });
    };
}

export function loadDocument(iri: IRI) {
    const action = {
        type: ActionType.LOAD_DOCUMENT
    };
    return (dispatch: ThunkDispatch) => {
        dispatch(asyncActionRequest(action));
        return Ajax
            .get(Constants.API_PREFIX + '/documents/' + iri.fragment, params({namespace: iri.namespace}))
            .then((data: object) =>
                jsonld.compact(data, DOCUMENT_CONTEXT))
            .then((data: DocumentData) =>
                dispatch(asyncActionSuccessWithPayload(action, new Document(data))))
            .catch((error: ErrorData) => {
                dispatch(asyncActionFailure(action, error));
                return dispatch(SyncActions.publishMessage(new Message(error, MessageType.ERROR)));
            });
    };
}