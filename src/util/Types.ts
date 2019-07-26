/**
 * Declaration of useful, reusable types.
 */

import {ThunkDispatch as TDispatch} from "redux-thunk";
import TermItState from "../model/TermItState";
import {Action} from "redux";

/**
 * Simple name for Thunk Dispatch, providing the required generic type arguments.
 *
 * Action can be specified.
 */
export type ThunkDispatch<A extends Action = Action> = TDispatch<TermItState, null, Action>;

/**
 * Simple name for a function retrieving state from the store.
 */
export type GetStoreState = () => TermItState;

/**
 * Mapper of values to JSX elements.
 */
export type ValueMapper<T> = (data: T) => JSX.Element | null;