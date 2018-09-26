import * as AsyncActions from './AsyncActions';
import Authentication from '../util/Authentication';
import {userLogout} from './SyncActions';
import Routes from '../util/Routes';
import Routing from '../util/Routing';
import Vocabulary from "../model/Vocabulary";
import VocabularyTerm from "../model/VocabularyTerm";
import FetchOptionsFunction from "../model/Functions";
import {IRI} from "../util/VocabularyUtils";
import {ThunkDispatch} from '../util/Types';

/*
 * Complex actions are basically just nice names for actions which involve both synchronous and asynchronous actions.
 * This way, the implementation details (e.g. that loginRequest means sending credentials to the server) do not leak into
 * the rest of the application.
 */

export function loadUser() {
    return (dispatch: ThunkDispatch) => {
        return dispatch(AsyncActions.fetchUser());
    };
}

export function login(username: string, password: string) {
    return (dispatch: ThunkDispatch) => {
        return dispatch(AsyncActions.login(username, password));
    };
}

export function register(user: { username: string, password: string }) {
    return (dispatch: ThunkDispatch) => {
        return dispatch(AsyncActions.register(user));
    };
}

export function logout() {
    Authentication.clearToken();
    Routing.transitionTo(Routes.login);
    return (dispatch: ThunkDispatch) => {
        dispatch(userLogout());
    };
}

export function createVocabulary(vocabulary: Vocabulary) {
    return (dispatch: ThunkDispatch) => {
        return dispatch(AsyncActions.createVocabulary(vocabulary));
    };
}

export function createVocabularyTerm(term: VocabularyTerm, normalizedName: string) {
    return (dispatch: ThunkDispatch) => {
        return dispatch(AsyncActions.createVocabularyTerm(term, normalizedName));
    };
}

export function loadVocabulary(iri: IRI) {
    return (dispatch: ThunkDispatch) => {
        return dispatch(AsyncActions.loadVocabulary(iri));
    };
}

export function loadVocabularies() {
    return (dispatch: ThunkDispatch) => {
        return dispatch(AsyncActions.loadVocabularies());
    };
}

export function fetchVocabularyTerms(fetchOptions: FetchOptionsFunction, normalizedName: string) {
    return (dispatch: ThunkDispatch) => {
        return dispatch(AsyncActions.fetchVocabularyTerms(fetchOptions, normalizedName));
    };
}

export function loadTerms(normalizedName: string) {
    return (dispatch: ThunkDispatch) => {
        return dispatch(AsyncActions.loadTerms(normalizedName));
    };
}

export function fetchVocabularySubTerms(parentTermID: string, normalizedName: string) {
    return (dispatch: ThunkDispatch) => {
        return dispatch(AsyncActions.fetchVocabularySubTerms(parentTermID, normalizedName));
    };
}

export function getVocabularyTermByID(termID: string, normalizedName: string) {
    return (dispatch: ThunkDispatch) => {
        return dispatch(AsyncActions.getVocabularyTermByID(termID, normalizedName));
    };
}

export function getVocabularyTermByName(termNormalizedName: string, vocabularyNormalizedName: string) {
    return (dispatch: ThunkDispatch) => {
        return dispatch(AsyncActions.getVocabularyTermByName(termNormalizedName, vocabularyNormalizedName));
    };
}

export function executeQuery(queryString: string) {
    return (dispatch: ThunkDispatch) => {
        return dispatch(AsyncActions.executeQuery(queryString));
    };
}

export function loadFileContent(iri: IRI, fileName: string) {
    return (dispatch: ThunkDispatch) => {
        return dispatch(AsyncActions.loadFileContent(iri, fileName));
    };
}

export function loadDocument(iri: IRI) {
    return (dispatch: ThunkDispatch) => {
        return dispatch(AsyncActions.loadDocument(iri));
    };
}

