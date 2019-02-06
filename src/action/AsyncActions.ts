import * as SyncActions from "./SyncActions";
import {
    asyncActionFailure,
    asyncActionRequest,
    asyncActionSuccess,
    asyncActionSuccessWithPayload,
    publishMessage,
    publishNotification
} from "./SyncActions";
import Ajax, {content, contentType, param, params} from "../util/Ajax";
import {GetStoreState, ThunkDispatch} from "../util/Types";
import Routing from "../util/Routing";
import Constants from "../util/Constants";
import User, {CONTEXT as USER_CONTEXT, UserData} from "../model/User";
import Vocabulary, {CONTEXT as VOCABULARY_CONTEXT, VocabularyData} from "../model/Vocabulary";
import Routes from "../util/Routes";
import {ErrorData} from "../model/ErrorInfo";
import {AxiosResponse} from "axios";
import * as jsonld from "jsonld";
import Message, {createFormattedMessage} from "../model/Message";
import MessageType from "../model/MessageType";
import Term, {CONTEXT as TERM_CONTEXT, TermData} from "../model/Term";
import FetchOptionsFunction from "../model/Functions";
import VocabularyUtils, {IRI} from "../util/VocabularyUtils";
import ActionType from "./ActionType";
import Resource, {CONTEXT as RESOURCE_CONTEXT, ResourceData} from "../model/Resource";
import RdfsResource, {CONTEXT as RDFS_RESOURCE_CONTEXT, RdfsResourceData} from "../model/RdfsResource";
import TermAssignment, {CONTEXT as TERM_ASSIGNMENT_CONTEXT, TermAssignmentData} from "../model/TermAssignment";
import TermItState from "../model/TermItState";
import Utils from "../util/Utils";
import ExportType from "../util/ExportType";
import File from "../model/File";
import {AssetData} from "../model/Asset";
import AssetFactory from "../util/AssetFactory";
import IdentifierResolver from "../util/IdentifierResolver";
import JsonLdUtils from "../util/JsonLdUtils";
import {Action} from "redux";

/*
 * Asynchronous actions involve requests to the backend server REST API. As per recommendations in the Redux docs, this consists
 * of several synchronous sub-actions which inform the application of initiation of the request and its result.
 *
 * Some conventions (they are also described in README.md):
 * API guidelines:
 *      _Load_   - use IRI identifiers as parameters (+ normalized name as string if necessary, e.g. when fetching a term).
 *      _Create_ - use the instance to be created as parameter + IRI identifier if additional context is necessary (e.g. when creating a term).
 *      _Update_ - use the instance to be updated as parameter. It should contain all the necessary data.
 *      _Remove_ - use the instance to be removed as parameter.
 *
 * Naming conventions for CRUD operations:
 *      _load${ASSET(S)}_ - loading assets from the server, e.g. `loadVocabulary`
 *      _create${ASSET}_  - creating an asset, e.g. `createVocabulary`
 *      _update${ASSET}_  - updating an asset, e.g. `updateVocabulary`
 *      _remove${ASSET}_  - removing an asset, e.g. `removeVocabulary`
 */

function isActionRequestPending(state: TermItState, action: Action) {
    return state.pendingActions[action.type] !== undefined;
}

export function loadUser() {
    const action = {
        type: ActionType.FETCH_USER
    };
    return (dispatch: ThunkDispatch) => {
        dispatch(asyncActionRequest(action));
        return Ajax.get(Constants.API_PREFIX + "/users/current")
            .then((data: object) => JsonLdUtils.compactAndResolveReferences(data, USER_CONTEXT))
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
        return Ajax.post("/j_spring_security_check", params({
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
            .then(() => dispatch(SyncActions.publishMessage(createFormattedMessage("message.welcome"))))
            .catch((error: ErrorData) => dispatch(asyncActionFailure(action, error)));
    };
}

export function register(user: { username: string, password: string }) {
    const action = {
        type: ActionType.REGISTER
    };
    return (dispatch: ThunkDispatch) => {
        dispatch(asyncActionRequest(action));
        return Ajax.post(Constants.API_PREFIX + "/users", content(user).contentType("application/json"))
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
        return Ajax.post(Constants.API_PREFIX + "/vocabularies", content(vocabulary.toJsonLd()))
            .then((resp: AxiosResponse) => {
                dispatch(asyncActionSuccess(action));
                const location = resp.headers[Constants.LOCATION_HEADER];
                Routing.transitionTo(Routes.vocabularyDetail, IdentifierResolver.routingOptionsFromLocation(location));
                return dispatch(SyncActions.publishMessage(new Message({messageId: "vocabulary.created.message"}, MessageType.SUCCESS)));
            })
            .catch((error: ErrorData) => {
                dispatch(asyncActionFailure(action, error));
                dispatch(SyncActions.publishMessage(new Message(error, MessageType.ERROR)));
                return undefined;
            });
    };
}

export function createTerm(term: Term, vocabularyIri: IRI) {
    const action = {
        type: ActionType.CREATE_VOCABULARY_TERM
    };
    return (dispatch: ThunkDispatch) => {
        dispatch(asyncActionRequest(action));
        let url = Constants.API_PREFIX + "/vocabularies/" + vocabularyIri.fragment + "/terms";
        if (term.parent) {
            url += "/" + VocabularyUtils.create(term.parent).fragment + "/subterms";
        }
        return Ajax.post(url, content(term.toJsonLd()).contentType(Constants.JSON_LD_MIME_TYPE).param("namespace", vocabularyIri.namespace))
            .then((resp: AxiosResponse) => {
                const asyncSuccessAction = asyncActionSuccess(action);
                dispatch(asyncSuccessAction);
                dispatch(SyncActions.publishMessage(new Message({messageId: "vocabulary.term.created.message"}, MessageType.SUCCESS)));
                dispatch(publishNotification({source: asyncSuccessAction}));
                return resp.headers[Constants.LOCATION_HEADER];
            })
            .catch((error: ErrorData) => {
                dispatch(asyncActionFailure(action, error));
                dispatch(SyncActions.publishMessage(new Message(error, MessageType.ERROR)));
                return undefined;
            });
    };
}

export function loadVocabulary(iri: IRI) {
    const action = {
        type: ActionType.LOAD_VOCABULARY
    };
    return (dispatch: ThunkDispatch, getState: () => TermItState) => {
        if (isActionRequestPending(getState(), action)) {
            return Promise.resolve({});
        }
        dispatch(asyncActionRequest(action));
        return Ajax
            .get(Constants.API_PREFIX + "/vocabularies/" + iri.fragment, param("namespace", iri.namespace))
            .then((data: object) => JsonLdUtils.compactAndResolveReferences(data, VOCABULARY_CONTEXT))
            .then((data: VocabularyData) =>
                dispatch(asyncActionSuccessWithPayload(action, new Vocabulary(data))))
            .catch((error: ErrorData) => {
                dispatch(asyncActionFailure(action, error));
                return dispatch(SyncActions.publishMessage(new Message(error, MessageType.ERROR)));
            });
    };
}

export function loadResource(iri: IRI) {
    const action = {
        type: ActionType.LOAD_RESOURCE
    };
    return (dispatch: ThunkDispatch, getState: GetStoreState) => {
        if (isActionRequestPending(getState(), action)) {
            return Promise.resolve({});
        }
        dispatch(asyncActionRequest(action));
        return Ajax
            .get(Constants.API_PREFIX + "/resources/" + iri.fragment, param("namespace", iri.namespace))
            .then((data: object) => JsonLdUtils.compactAndResolveReferences(data, RESOURCE_CONTEXT))
            .then((data: ResourceData) =>
                dispatch(asyncActionSuccessWithPayload(action, new Resource(data))))
            .catch((error: ErrorData) => {
                dispatch(asyncActionFailure(action, error));
                return dispatch(SyncActions.publishMessage(new Message(error, MessageType.ERROR)))
            });
    };
}

export function loadResources() {
    const action = {
        type: ActionType.LOAD_RESOURCES
    };
    return (dispatch: ThunkDispatch, getState: GetStoreState) => {
        if (isActionRequestPending(getState(), action)) {
            return Promise.resolve({});
        }
        dispatch(asyncActionRequest(action));
        return Ajax.get(Constants.API_PREFIX + "/resources")
            .then((data: object[]) =>
                data.length !== 0 ? JsonLdUtils.compactAndResolveReferencesAsArray(data, RESOURCE_CONTEXT) : [])
            .then((data: ResourceData[]) =>
                dispatch(asyncActionSuccessWithPayload(action, data.map(v => new Resource(v)))))
            .catch((error: ErrorData) => {
                dispatch(asyncActionFailure(action, error));
                return dispatch(SyncActions.publishMessage(new Message(error, MessageType.ERROR)));
            });
    };
}

export function loadResourceTerms(iri: IRI) {
    const action = {
        type: ActionType.LOAD_RESOURCE_TERMS
    };
    return (dispatch: ThunkDispatch, getState: GetStoreState) => {
        if (isActionRequestPending(getState(), action)) {
            return Promise.resolve({});
        }
        dispatch(asyncActionRequest(action));
        return Ajax.get(Constants.API_PREFIX + "/resources/" + iri.fragment + "/terms", param("namespace", iri.namespace))
            .then((data: object[]) => data.length > 0 ? JsonLdUtils.compactAndResolveReferencesAsArray(data, TERM_CONTEXT) : [])
            .then((data: TermData[]) => {
                const terms = data.map(d => new Term(d));
                return dispatch(asyncActionSuccessWithPayload(action, terms));
            }).catch((error: ErrorData) => {
                dispatch(asyncActionFailure(action, error));
                return dispatch(SyncActions.publishMessage(new Message(error, MessageType.ERROR)));
            });
    };
}

export function createResource(resource: Resource) {
    const action = {
        type: ActionType.CREATE_RESOURCE
    };
    return (dispatch: ThunkDispatch) => {
        dispatch(asyncActionRequest(action));
        return Ajax.post(Constants.API_PREFIX + "/resources", content(resource.toJsonLd()))
            .then((resp: AxiosResponse) => {
                dispatch(asyncActionSuccess(action));
                dispatch(loadResources());
                const location = resp.headers[Constants.LOCATION_HEADER];
                Routing.transitionTo(Routes.resourceSummary, IdentifierResolver.routingOptionsFromLocation(location));
                return dispatch(SyncActions.publishMessage(new Message({messageId: "resource.created.message"}, MessageType.SUCCESS)));
            })
            .catch((error: ErrorData) => {
                dispatch(asyncActionFailure(action, error));
                dispatch(SyncActions.publishMessage(new Message(error, MessageType.ERROR)));
                return undefined;
            });
    };
}

export function removeResource(resource: Resource) {
    const action = {
        type: ActionType.REMOVE_RESOURCE
    };
    return (dispatch: ThunkDispatch) => {
        dispatch(asyncActionRequest(action));
        const resourceIri = VocabularyUtils.create(resource.iri);
        return Ajax.delete(Constants.API_PREFIX + "/resources/" + resourceIri.fragment, param("namespace", resourceIri.namespace))
            .then(() => {
                dispatch(asyncActionSuccess(action));
                dispatch(loadResources());
                Routing.transitionTo(Routes.resources);
                return dispatch(SyncActions.publishMessage(new Message({messageId: "resource.removed.message"}, MessageType.SUCCESS)));
            })
            .catch((error: ErrorData) => {
                dispatch(asyncActionFailure(action, error));
                return dispatch(SyncActions.publishMessage(new Message(error, MessageType.ERROR)));
            });
    }
}

export function loadVocabularies() {
    const action = {
        type: ActionType.LOAD_VOCABULARIES
    };
    return (dispatch: ThunkDispatch, getState: GetStoreState) => {
        if (isActionRequestPending(getState(), action)) {
            return Promise.resolve({});
        }
        dispatch(asyncActionRequest(action));
        return Ajax.get(Constants.API_PREFIX + "/vocabularies")
            .then((data: object[]) =>
                data.length !== 0 ? JsonLdUtils.compactAndResolveReferencesAsArray(data, VOCABULARY_CONTEXT) : [])
            .then((data: VocabularyData[]) =>
                dispatch(asyncActionSuccessWithPayload(action, data.map(v => new Vocabulary(v)))))
            .catch((error: ErrorData) => {
                dispatch(asyncActionFailure(action, error));
                return dispatch(SyncActions.publishMessage(new Message(error, MessageType.ERROR)));
            });
    };
}

export function loadDefaultTerms(vocabularyIri: IRI) {
    const action = {
        type: ActionType.LOAD_DEFAULT_TERMS
    };
    return (dispatch: ThunkDispatch) => {
        dispatch(loadTerms({}, vocabularyIri))
            .then((result: Term[]) => dispatch(dispatch(asyncActionSuccessWithPayload(action, result))))
    }
}

export function loadTerms(fetchOptions: FetchOptionsFunction, vocabularyIri: IRI) {
    const action = {
        type: ActionType.FETCH_VOCABULARY_TERMS
    };
    return (dispatch: ThunkDispatch) => {
        dispatch(asyncActionRequest(action, true));
        let url: string;
        if (fetchOptions.optionID) {
            url = Constants.API_PREFIX + "/vocabularies/" + vocabularyIri.fragment + "/terms/" + VocabularyUtils.getFragment(fetchOptions.optionID) + "/subterms"
        } else {
            // Fetching roots only
            url = Constants.API_PREFIX + "/vocabularies/" + vocabularyIri.fragment + "/terms/roots";
        }
        return Ajax.get(url,
            params(Object.assign({
                searchString: fetchOptions.searchString,
                namespace: vocabularyIri.namespace
            }, Utils.createPagingParams(fetchOptions.offset, fetchOptions.limit))))
            .then((data: object[]) => data.length !== 0 ? JsonLdUtils.compactAndResolveReferencesAsArray(data, TERM_CONTEXT) : [])
            .then((data: TermData[]) => data.map(d => new Term(d)))
            .catch((error: ErrorData) => {
                dispatch(asyncActionFailure(action, error));
                return [];
            });
    };
}

export function fetchVocabularyTerm(termNormalizedName: string, vocabularyIri: IRI) {
    const action = {
        type: ActionType.FETCH_TERM
    };
    return (dispatch: ThunkDispatch) => {
        dispatch(asyncActionRequest(action, true));
        return Ajax.get(Constants.API_PREFIX + "/vocabularies/" + vocabularyIri.fragment + "/terms/" + termNormalizedName, param("namespace", vocabularyIri.namespace))
            .then((data: object) => JsonLdUtils.compactAndResolveReferences(data, TERM_CONTEXT))
            .then((data: TermData) => new Term(data))
    };
}

export function loadTerm(termNormalizedName: string, vocabularyIri: IRI) {
    const action = {
        type: ActionType.LOAD_TERM
    };
    return (dispatch: ThunkDispatch) => {
        dispatch(asyncActionRequest(action));
        return Ajax.get(Constants.API_PREFIX + "/vocabularies/" + vocabularyIri.fragment + "/terms/" + termNormalizedName, param("namespace", vocabularyIri.namespace))
            .then((data: object) => JsonLdUtils.compactAndResolveReferences(data, TERM_CONTEXT))
            .then((data: TermData) => dispatch(asyncActionSuccessWithPayload(action, new Term(data))))
            .catch((error: ErrorData) => {
                dispatch(asyncActionFailure(action, error));
                return dispatch(SyncActions.publishMessage(new Message(error, MessageType.ERROR)));
            });
    };
}

export function executeQuery(queryString: string) {
    const action = {
        type: ActionType.EXECUTE_QUERY
    };
    return (dispatch: ThunkDispatch) => {
        dispatch(asyncActionRequest(action, true));
        return Ajax
            .get(Constants.API_PREFIX + "/query", params({query: queryString}))
            .then((data: object) =>
                jsonld.expand(data))
            .then((data: object) =>
                dispatch(SyncActions.executeQuerySuccess(queryString, data)))
            .catch((error: ErrorData) => {
                dispatch(asyncActionFailure(action, error));
                return dispatch(SyncActions.publishMessage(new Message(error, MessageType.ERROR)));
            });
    };
}

export function loadTypes(language: string) {
    const action = {
        type: ActionType.LOAD_TYPES
    };
    return (dispatch: ThunkDispatch) => {
        dispatch(asyncActionRequest(action));
        return Ajax
            .get(Constants.API_PREFIX + "/language/types", params({language}))
            .then((data: object[]) =>
                data.length !== 0 ? JsonLdUtils.compactAndResolveReferencesAsArray(data, TERM_CONTEXT) : [])
            .then((data: TermData[]) => {
                data.forEach((term: Term) => {
                    if (term.subTerms) {
                        // @ts-ignore
                        term.subTerms = Utils.sanitizeArray(term.subTerms).map(subTerm => subTerm.iri);
                    }
                });
                return data
            })
            .then((result: Term[]) => dispatch(asyncActionSuccessWithPayload(action, result)))
            .catch((error: ErrorData) => {
                dispatch(asyncActionFailure(action, error));
                return dispatch(SyncActions.publishMessage(new Message(error, MessageType.ERROR)));
            });
    };
}

export function startFileTextAnalysis(file: File) {
    const action = {
        type: ActionType.START_FILE_TEXT_ANALYSIS
    };
    const iri = VocabularyUtils.create(file.iri);
    return (dispatch: ThunkDispatch) => {
        dispatch(asyncActionRequest(action));
        return Ajax
            .put(Constants.API_PREFIX + "/resources/" + iri.fragment + "/text-analysis", param("namespace", iri.namespace))
            .then(() => {
                dispatch(asyncActionSuccess(action));
                return dispatch(publishMessage(new Message({
                    messageId: "file.text-analysis.started.message",
                    values: {"fileName": file.label}
                }, MessageType.SUCCESS)));
            })
            .catch((error: ErrorData) => {
                dispatch(asyncActionFailure(action, error));
                return dispatch(SyncActions.publishMessage(new Message(error, MessageType.ERROR)));
            });
    };
}

export function loadFileContent(fileIri: IRI) {
    const action = {
        type: ActionType.LOAD_FILE_CONTENT
    };
    return (dispatch: ThunkDispatch, getState: GetStoreState) => {
        if (isActionRequestPending(getState(), action)) {
            return Promise.resolve({});
        }
        dispatch(asyncActionRequest(action));
        return Ajax
            .get(Constants.API_PREFIX + "/resources/" + fileIri.fragment + "/content", param("namespace", fileIri.namespace))
            .then((data: object) => data.toString())
            .then((data: string) => dispatch(asyncActionSuccessWithPayload(action, data)))
            .catch((error: ErrorData) => {
                dispatch(asyncActionFailure(action, error));
                return dispatch(SyncActions.publishMessage(new Message(error, MessageType.ERROR)));
            });
    };
}

export function saveFileContent(fileIri: IRI, fileContent: string) {
    const action = {
        type: ActionType.SAVE_FILE_CONTENT
    };
    const formData = new FormData();
    const fileBlob = new Blob([fileContent], {type: "text/html"});
    formData.append("file", fileBlob, fileIri.fragment);
    if (fileIri.namespace) {
        formData.append("namespace", fileIri.namespace);
    }
    return (dispatch: ThunkDispatch) => {
        dispatch(asyncActionRequest(action, true));
        return Ajax
            .post(
                Constants.API_PREFIX + "/resources/" + fileIri.fragment + "/content",
                contentType(Constants.MULTIPART_FORM_DATA).formData(formData)
            )
            .then((data: object) => fileContent)// TODO load from the service instead
            .then((data: string) => dispatch(asyncActionSuccessWithPayload(action, data)))
            .catch((error: ErrorData) => {
                dispatch(asyncActionFailure(action, error));
                return dispatch(SyncActions.publishMessage(new Message(error, MessageType.ERROR)));
            });
    };
}

export function updateTerm(term: Term) {
    const action = {
        type: ActionType.UPDATE_TERM
    };
    return (dispatch: ThunkDispatch) => {
        dispatch(asyncActionRequest(action));
        const termIri = VocabularyUtils.create(term.iri);
        const vocabularyIri = VocabularyUtils.create(term.vocabulary!.iri!);
        const reqUrl = Constants.API_PREFIX + "/vocabularies/" + vocabularyIri.fragment + "/terms/" + termIri.fragment;
        // Vocabulary namespace defines also term namespace
        return Ajax.put(reqUrl, content(term.toJsonLd()).params({namespace: vocabularyIri.namespace}))
            .then(() => {
                dispatch(asyncActionSuccess(action));
                return dispatch(publishMessage(new Message({messageId: "term.updated.message"}, MessageType.SUCCESS)));
            })
            .catch((error: ErrorData) => {
                dispatch(asyncActionFailure(action, error));
                return dispatch(SyncActions.publishMessage(new Message(error, MessageType.ERROR)));
            });
    };
}

export function updateResourceTerms(res: Resource) {
    const action = {
        type: ActionType.UPDATE_RESOURCE_TERMS
    };
    return (dispatch: ThunkDispatch) => {
        dispatch(asyncActionRequest(action));
        const resourceIri = VocabularyUtils.create(res.iri);
        return Ajax.put(Constants.API_PREFIX + "/resources/" + resourceIri.fragment + "/terms",
            content(res.terms!.map(t => t.iri))
                .params({namespace: resourceIri.namespace}).contentType("application/json"))
            .then(() => {
                dispatch(asyncActionSuccess(action));
                return dispatch(publishMessage(new Message({messageId: "resource.updated.message"}, MessageType.SUCCESS)));
            })
            .catch((error: ErrorData) => {
                dispatch(asyncActionFailure(action, error));
                return dispatch(SyncActions.publishMessage(new Message(error, MessageType.ERROR)));
            });
    };
}


export function updateVocabulary(vocabulary: Vocabulary) {
    const action = {
        type: ActionType.UPDATE_VOCABULARY
    };
    return (dispatch: ThunkDispatch) => {
        dispatch(asyncActionRequest(action));
        const vocabularyIri = VocabularyUtils.create(vocabulary.iri);
        const reqUrl = Constants.API_PREFIX + "/vocabularies/" + vocabularyIri.fragment;
        return Ajax.put(reqUrl, content(vocabulary.toJsonLd()).params({namespace: vocabularyIri.namespace}))
            .then(() => {
                dispatch(asyncActionSuccess(action));
                dispatch(loadVocabulary(vocabularyIri));
                return dispatch(publishMessage(new Message({messageId: "vocabulary.updated.message"}, MessageType.SUCCESS)));
            })
            .catch((error: ErrorData) => {
                dispatch(asyncActionFailure(action, error));
                return dispatch(SyncActions.publishMessage(new Message(error, MessageType.ERROR)));
            });
    };
}

/**
 * Fetches RDFS:label of a resource with the specified identifier.
 * @param iri Resource identifier
 */
export function getLabel(iri: string) {
    const action = {
        type: ActionType.GET_LABEL
    };
    return (dispatch: ThunkDispatch) => {
        dispatch(asyncActionRequest(action, true));
        return Ajax.get(Constants.API_PREFIX + "/data/label", param("iri", iri)).then(data => {
            dispatch(asyncActionSuccess(action));
            return data;
        }).catch((error: ErrorData) => {
            dispatch(asyncActionFailure(action, error));
            return undefined;
        });
    };
}

/**
 * Fetches properties existing in the server repository.
 */
export function getProperties() {
    const action = {
        type: ActionType.GET_PROPERTIES
    };
    return (dispatch: ThunkDispatch, getState: () => TermItState) => {
        if (getState().properties.length > 0) {
            return;
        }
        dispatch(asyncActionRequest(action, true));
        return Ajax.get(Constants.API_PREFIX + "/data/properties")
            .then((data: object[]) => data.length > 0 ? JsonLdUtils.compactAndResolveReferencesAsArray(data, RDFS_RESOURCE_CONTEXT) : [])
            .then((data: RdfsResourceData[]) => dispatch(asyncActionSuccessWithPayload(action, data.map(d => new RdfsResource(d)))))
            .catch((error: ErrorData) => dispatch(asyncActionFailure(action, error)));
    };
}

export function createProperty(property: RdfsResource) {
    const action = {
        type: ActionType.CREATE_PROPERTY
    };
    return (dispatch: ThunkDispatch) => {
        dispatch(asyncActionRequest(action, true));
        return Ajax.post(Constants.API_PREFIX + "/data/properties", content(property.toJsonLd()))
            .then(() => dispatch(asyncActionSuccess(action)))
            .catch((error: ErrorData) => dispatch(asyncActionFailure(action, error)));
    }
}

export function loadTermAssignments(term: Term) {
    const action = {
        type: ActionType.LOAD_TERM_ASSIGNMENTS
    };
    return (dispatch: ThunkDispatch) => {
        dispatch(asyncActionRequest(action, true));
        const vocabularyIri = VocabularyUtils.create(term.vocabulary!.iri!);
        const url = "/vocabularies/" + vocabularyIri.fragment + "/terms/" + VocabularyUtils.getFragment(term.iri) + "/assignments";
        return Ajax.get(Constants.API_PREFIX + url, param("namespace", vocabularyIri.namespace))
            .then((data: object) => JsonLdUtils.compactAndResolveReferencesAsArray(data, TERM_ASSIGNMENT_CONTEXT))
            .then((data: TermAssignmentData[]) => {
                dispatch(asyncActionSuccess(action));
                return data.map(tad => new TermAssignment(tad));
            })
            .catch((error: ErrorData) => {
                dispatch(asyncActionFailure(action, error));
                return [];
            });
    };
}

export function exportGlossary(vocabularyIri: IRI, type: ExportType) {
    const action = {
        type: ActionType.EXPORT_GLOSSARY
    };
    return (dispatch: ThunkDispatch) => {
        dispatch(asyncActionRequest(action));
        const url = Constants.API_PREFIX + "/vocabularies/" + vocabularyIri.fragment + "/terms";
        return Ajax.getRaw(url, param("namespace", vocabularyIri.namespace).accept(type.mimeType).responseType("arraybuffer"))
            .then((resp: AxiosResponse) => {
                const disposition = resp.headers[Constants.CONTENT_DISPOSITION_HEADER];
                const filenameMatch = disposition ? disposition.match(/filename="(.+\..+)"/) : null;
                if (filenameMatch) {
                    const fileName = filenameMatch[1];
                    Utils.fileDownload(resp.data, fileName, type.mimeType);
                    return dispatch(asyncActionSuccess(action));
                } else {
                    const error: ErrorData = {
                        requestUrl: url,
                        messageId: "vocabulary.summary.export.error"
                    };
                    dispatch(asyncActionFailure(action, error));
                    return dispatch(SyncActions.publishMessage(new Message(error, MessageType.ERROR)))
                }
            })
            .catch((error: ErrorData) => dispatch(asyncActionFailure(action, error)));
    }
}

export function loadLastEditedAssets() {
    const action = {
        type: ActionType.LOAD_LAST_EDITED
    };
    const context = Object.assign({}, RESOURCE_CONTEXT, TERM_CONTEXT, VOCABULARY_CONTEXT);
    return (dispatch: ThunkDispatch) => {
        dispatch(asyncActionRequest(action, true));
        return Ajax.get(Constants.API_PREFIX + "/assets/last-edited")
            .then((data: object) => JsonLdUtils.compactAndResolveReferencesAsArray(data, context))
            .then((data: AssetData[]) => {
                dispatch(asyncActionSuccess(action));
                return data.map(item => AssetFactory.createAsset(item));
            })
            .catch((error: ErrorData) => {
                dispatch(asyncActionFailure(action, error));
                return [];
            });
    }
}
