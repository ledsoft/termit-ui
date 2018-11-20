/**
 * Search-related actions
 */

import * as SyncActions from './SyncActions';
import * as AsyncActions from './AsyncActions';
import Ajax, {params} from '../util/Ajax';
import {ThunkDispatch} from '../util/Types';
import Constants from '../util/Constants';
import {ErrorData} from "../model/ErrorInfo";
import * as jsonld from "jsonld";
import Message from "../model/Message";
import MessageType from "../model/MessageType";
import ActionType from "./ActionType";
import SearchResult, {CONTEXT as SEARCH_RESULT_CONTEXT, SearchResultData} from "../model/SearchResult";
import TermItState from "../model/TermItState";

export function addSearchListener() {
    return (dispatch: ThunkDispatch, getState: () => TermItState) => {
        dispatch({
            type: ActionType.ADD_SEARCH_LISTENER,
        });

        // Trigger the search when the first search listener appears
        const newState = getState();
        if (newState.searchListenerCount === 1) {
            return dispatch(searchEverything());
        } else {
            return Promise.resolve();
        }
    };
}

export function removeSearchListener() {
    return {
        type: ActionType.REMOVE_SEARCH_LISTENER,
    };
}

export function updateSearchFilter(searchString: string) {
    return (dispatch: ThunkDispatch) => {
        dispatch({
            type: ActionType.UPDATE_SEARCH_FILTER,
            searchString,
        });

        // TODO: Add timeout to delay the search when typing
        return dispatch(searchEverything());
    }
}

export function searchEverything() {
    return (dispatch: ThunkDispatch, getState: () => TermItState) => {
        const state: TermItState = getState();
        if (state.searchListenerCount > 0) {
            window.console.log('OK, SEARCH NOW!');
            return dispatch(search(state.searchQuery, true));
        } else {
            return Promise.resolve();
        }
    };
}

export function search(searchString: string, disableLoading: boolean = false) {
    const action = {
        type: ActionType.SEARCH
    };
    return (dispatch: ThunkDispatch) => {
        dispatch(SyncActions.asyncActionRequest(action, disableLoading));
        return Ajax.get(Constants.API_PREFIX + '/search/label', params({searchString: encodeURI(searchString)}))
            .then((data: object[]) => data.length > 0 ? jsonld.compact(data, SEARCH_RESULT_CONTEXT) : [])
            .then((compacted: object) => AsyncActions.loadArrayFromCompactedGraph(compacted))
            .then((data: SearchResultData[]) => {
                dispatch(SyncActions.asyncActionSuccess(action));
                return data.map(d => new SearchResult(d));
            }).catch((error: ErrorData) => {
                dispatch(SyncActions.asyncActionFailure(action, error));
                return dispatch(SyncActions.publishMessage(new Message(error, MessageType.ERROR)));
            });
    };
}

