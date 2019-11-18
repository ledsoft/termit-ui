/*
 * Asynchronous actions involve requests to the backend server REST API. As per recommendations in the Redux docs, this consists
 * of several synchronous sub-actions which inform the application of initiation of the request and its result.
 *
 * This file contains asynchronous actions related to user management in the frontend.
 */

import ActionType from "./ActionType";
import {ThunkDispatch} from "../util/Types";
import Ajax, {param} from "../util/Ajax";
import Constants from "../util/Constants";
import JsonLdUtils from "../util/JsonLdUtils";
import User, {CONTEXT as USER_CONTEXT, UserData} from "../model/User";
import {asyncActionFailure, asyncActionRequest, asyncActionSuccess, publishMessage} from "./SyncActions";
import {ErrorData} from "../model/ErrorInfo";
import Message from "../model/Message";
import MessageType from "../model/MessageType";
import {isActionRequestPending} from "./AsyncActions";
import TermItState from "../model/TermItState";
import VocabularyUtils from "../util/VocabularyUtils";

const USERS_ENDPOINT = "/users";

export function loadUsers() {
    const action = {
        type: ActionType.LOAD_USERS
    };
    return (dispatch: ThunkDispatch, getState: () => TermItState) => {
        if (isActionRequestPending(getState(), action)) {
            return Promise.resolve([]);
        }
        dispatch(asyncActionRequest(action));
        return Ajax.get(Constants.API_PREFIX + USERS_ENDPOINT)
            .then((data: object) => JsonLdUtils.compactAndResolveReferencesAsArray(data, USER_CONTEXT))
            .then((data: UserData[]) => {
                dispatch(asyncActionSuccess(action));
                return data.map(d => new User(d));
            })
            .catch((error: ErrorData) => {
                dispatch(asyncActionFailure(action, error));
                dispatch(publishMessage(new Message(error, MessageType.ERROR)));
                return [];
            });
    };
}

export function disableUser(user: User) {
    const action = {
        type: ActionType.DISABLE_USER
    };
    return (dispatch: ThunkDispatch) => {
        dispatch(asyncActionRequest(action));
        const iri = VocabularyUtils.create(user.iri);
        return Ajax.delete(`${Constants.API_PREFIX}${USERS_ENDPOINT}/${iri.fragment}/status`, param("namespace", iri.namespace))
            .then(() => {
                dispatch(asyncActionSuccess(action));
                return dispatch(publishMessage(new Message({messageId: "administration.users.status.action.disable.success"}, MessageType.SUCCESS)));
            })
            .catch((error: ErrorData) => {
                dispatch(asyncActionFailure(action, error));
                return dispatch(publishMessage(new Message(error, MessageType.ERROR)));
            });
    }
}

export function enableUser(user: User) {
    const action = {
        type: ActionType.ENABLE_USER
    };
    return (dispatch: ThunkDispatch) => {
        dispatch(asyncActionRequest(action));
        const iri = VocabularyUtils.create(user.iri);
        return Ajax.post(`${Constants.API_PREFIX}${USERS_ENDPOINT}/${iri.fragment}/status`, param("namespace", iri.namespace))
            .then(() => {
                dispatch(asyncActionSuccess(action));
                return dispatch(publishMessage(new Message({messageId: "administration.users.status.action.enable.success"}, MessageType.SUCCESS)));
            })
            .catch((error: ErrorData) => {
                dispatch(asyncActionFailure(action, error));
                return dispatch(publishMessage(new Message(error, MessageType.ERROR)));
            });
    }
}
