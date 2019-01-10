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
import Timer = NodeJS.Timer;

/**
 * Add a search listener using a simple reference counting.
 * Search listener is anything that shows search results.
 */
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

/**
 * Remove a search listener.
 */
export function removeSearchListener() {
    return {
        type: ActionType.REMOVE_SEARCH_LISTENER,
    };
}

/**
 * Timer to delay search requests as user is still typing.
 */
let updateSearchTimer: Timer|null = null;
const updateSearchDelay = 400; // ms

/**
 * Change the search criteria and trigger a new search.
 */
export function updateSearchFilter(searchString: string) {
    return (dispatch: ThunkDispatch, getState: () => TermItState) => {
        dispatch({
            type: ActionType.UPDATE_SEARCH_FILTER,
            searchString,
        });

        // Clear search results
        dispatch({ type: ActionType.SEARCH_START });
        dispatch({ type: ActionType.SEARCH_RESULT, searchResults: null });

        // Stop waiting after previous update
        if (updateSearchTimer) {
            clearTimeout(updateSearchTimer);
        }

        const state = getState();
        if (state.searchQuery.isEmpty()) {
            // Don't delay empty query as it will just reset searches without bothering the server
            dispatch(searchEverything());
        } else {
            // Delay the search while user types the query
            updateSearchTimer = setTimeout(() => {
                updateSearchTimer = null;
                dispatch(searchEverything());
            }, updateSearchDelay);
        }
    }
}

/**
 * Start searching according the search criteria.
 * No search is triggered if nobody listens for the results.
 */
export function searchEverything() {
    return (dispatch: ThunkDispatch, getState: () => TermItState) => {
        const state: TermItState = getState();
        if (state.searchListenerCount > 0 && !state.searchQuery.isEmpty()) {
            window.console.info("%c 🔍 Searching ... ", "color: black; font-weight: bold; background: yellow;");
            return dispatch(search(state.searchQuery.searchQuery, true));
        } else {
            dispatch({ type: ActionType.SEARCH_FINISH });
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
        return Ajax.get(Constants.API_PREFIX + "/search/label", params({searchString}))
            .then((data: object[]) => data.length > 0 ? jsonld.compact(data, SEARCH_RESULT_CONTEXT) : [])
            .then((compacted: object) => AsyncActions.loadArrayFromCompactedGraph(compacted))
            .then((data: SearchResultData[]) => {
                dispatch(searchResult(data.map(d => new SearchResult(d))));
                dispatch(SyncActions.asyncActionSuccess(action));
            }).catch((error: ErrorData) => {
                dispatch(SyncActions.asyncActionFailure(action, error));
                return dispatch(SyncActions.publishMessage(new Message(error, MessageType.ERROR)));
            });
    };
}

export function autocompleteSearch(searchString: string, disableLoading: boolean = false) {
    const action = {
        type: ActionType.SEARCH
    };
    return (dispatch: ThunkDispatch) => {
        dispatch(SyncActions.asyncActionRequest(action, disableLoading));
        return Ajax.get(Constants.API_PREFIX + "/search/label", params({searchString}))
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

export function searchResult(searchResults: SearchResult[]) {
    return (dispatch: ThunkDispatch) => {
        dispatch({ type: ActionType.SEARCH_RESULT, searchResults });
        dispatch({ type: ActionType.SEARCH_FINISH });
    };
}

