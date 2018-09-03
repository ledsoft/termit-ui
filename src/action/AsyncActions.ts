import * as SyncActions from './SyncActions';
import Ajax, {content, params} from '../util/Ajax';
import {Action, Dispatch} from 'redux';
import {ThunkDispatch} from 'redux-thunk';
import Routing from '../util/Routing';
import Constants from '../util/Constants';
import Authentication from '../util/Authentication';
import {UserData} from '../model/User';
import Vocabulary, {CONTEXT as VOCABULARY_CONTEXT, VocabularyData} from "../model/Vocabulary";
import Routes from "../util/Routes";
import IdentifierResolver from "../util/IdentifierResolver";
import {ErrorData} from "../model/ErrorInfo";
import {AxiosResponse} from "axios";
import * as jsonld from "jsonld";

/*
 * Asynchronous actions involve requests to the backend server REST API. As per recommendations in the Redux docs, this consists
 * of several synchronous sub-actions which inform the application of initiation of the request and its result.
 */

export function fetchUser() {
    return (dispatch: Dispatch) => {
        dispatch(SyncActions.fetchUserRequest());
        return Ajax.get(Constants.API_PREFIX + '/users/current')
            .then((data: UserData) => dispatch(SyncActions.fetchUserSuccess(data)))
            .catch((error: ErrorData) => dispatch(SyncActions.fetchUserFailure(error)));
    };
}

export function login(username: string, password: string) {
    return (dispatch: Dispatch) => {
        dispatch(SyncActions.loginRequest());
        return Ajax.post('/j_spring_security_check', params({username, password}))
            .then((resp: AxiosResponse) => {
                const data = resp.data;
                if (!data.loggedIn) {
                    return Promise.reject(data);
                } else {
                    Authentication.saveToken(resp.headers[Constants.AUTHENTICATION_HEADER]);
                    Routing.transitionToHome();
                    dispatch(SyncActions.loginSuccess());
                    return Promise.resolve();
                }
            }).catch((error: ErrorData) => dispatch(SyncActions.loginFailure(error)));
    };
}

export function register(user: { username: string, password: string }) {
    return (dispatch: ThunkDispatch<object, undefined, Action>) => {
        dispatch(SyncActions.registerRequest());
        return Ajax.post(Constants.API_PREFIX + '/users', content(user).contentType('application/json'))
            .then(() => dispatch(SyncActions.registerSuccess()))
            .then(() => dispatch(login(user.username, user.password)))
            .catch((error: ErrorData) => dispatch(SyncActions.registerFailure(error)));
    };
}

export function createVocabulary(vocabulary: Vocabulary) {
    return (dispatch: ThunkDispatch<object, undefined, Action>) => {
        dispatch(SyncActions.createVocabularyRequest());
        return Ajax.post(Constants.API_PREFIX + '/vocabularies', content(vocabulary.toJsonLd()))
            .then((resp: AxiosResponse) => {
                dispatch(SyncActions.createVocabularySuccess());
                const location = resp.headers[Constants.LOCATION_HEADER];
                Routing.transitionTo(Routes.vocabularyDetail, IdentifierResolver.routingOptionsFromLocation(location));
            })
            .catch((error: ErrorData) => dispatch(SyncActions.createVocabularyFailure(error)));
    };
}

export function loadVocabulary(normalizedName: string) {
    return (dispatch: ThunkDispatch<object, undefined, Action>) => {
        dispatch(SyncActions.loadVocabularyRequest());
        return Ajax.get(Constants.API_PREFIX + '/vocabularies/' + normalizedName)
            .then((data: object) => jsonld.compact(data, VOCABULARY_CONTEXT))
            .then((data: VocabularyData) => dispatch(SyncActions.loadVocabularySuccess(data)))
            .catch((error: ErrorData) => dispatch(SyncActions.loadVocabularyFailure(error)));
    };
}