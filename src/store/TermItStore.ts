import {applyMiddleware, createStore} from "redux";
import {createLogger} from 'redux-logger';
import thunk from "redux-thunk";
import TermItReducers from "../reducer/TermItReducers";

const loggerMiddleware = createLogger();

const TermItStore = createStore(TermItReducers, applyMiddleware(thunk, loggerMiddleware));

export default TermItStore;