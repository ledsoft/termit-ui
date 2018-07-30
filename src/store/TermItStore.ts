import {applyMiddleware, createStore} from "redux";
import thunk from "redux-thunk";
import TermItReducers from "../reducer/TermItReducers";

const TermItStore = createStore(TermItReducers, applyMiddleware(thunk));

export default TermItStore;