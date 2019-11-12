/*
 * Asynchronous actions involve requests to the backend server REST API. As per recommendations in the Redux docs, this consists
 * of several synchronous sub-actions which inform the application of initiation of the request and its result.
 *
 * This file contains asynchronous actions related to user management in the frontend.
 */

import ActionType from "./ActionType";
import {ThunkDispatch} from "../util/Types";
import Ajax from "../util/Ajax";
import Constants from "../util/Constants";
import JsonLdUtils from "../util/JsonLdUtils";
import User, {CONTEXT as USER_CONTEXT, UserData} from "../model/User";
import * as SyncActions from "./SyncActions";
import {asyncActionFailure, asyncActionRequest, asyncActionSuccess} from "./SyncActions";
import {ErrorData} from "../model/ErrorInfo";
import Message from "../model/Message";
import MessageType from "../model/MessageType";
import {isActionRequestPending} from "./AsyncActions";
import TermItState from "../model/TermItState";

export function loadUsers() {
    const action = {
        type: ActionType.LOAD_USERS
    };
    return (dispatch: ThunkDispatch, getState: () => TermItState) => {
        if (isActionRequestPending(getState(), action)) {
            return Promise.resolve([]);
        }
        dispatch(asyncActionRequest(action));
        return Ajax.get(Constants.API_PREFIX + "/users")
            .then((data: object) => JsonLdUtils.compactAndResolveReferencesAsArray(data, USER_CONTEXT))
            .then((data: UserData[]) => {
                dispatch(asyncActionSuccess(action));
                return data.map(d => new User(d));
            })
            .catch((error: ErrorData) => {
                dispatch(asyncActionFailure(action, error));
                dispatch(SyncActions.publishMessage(new Message(error, MessageType.ERROR)));
                return [];
            });
    };
}
