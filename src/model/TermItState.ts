import User, {EMPTY_USER} from "./User";
import ErrorInfo, {EMPTY_ERROR} from "./ErrorInfo";
import Message from "./Message";
import en from '../i18n/en';
import IntlData from "./IntlData";
import Vocabulary, {EMPTY_VOCABULARY} from "./Vocabulary";
import {QueryResultIF} from "./QueryResult";
import SearchResult from "./SearchResult";

/**
 * This is the basic shape of the application's state managed by Redux.
 */
export default class TermItState {
    public loading: boolean;
    public user: User;
    public vocabulary: Vocabulary;
    public vocabularies: {[key:string]: Vocabulary};
    public error: ErrorInfo;
    public messages: Message[];
    public intl: IntlData;
    public terms: any;
    public queryResults: {[key: string] : QueryResultIF};
    public searchResults: SearchResult[];

    constructor() {
        this.loading = false;
        this.user = EMPTY_USER;
        this.vocabulary = EMPTY_VOCABULARY;
        this.vocabularies = {};
        this.error = EMPTY_ERROR;
        this.messages = [];
        this.intl = en;
        this.terms = null;
        this.queryResults = {};
        this.searchResults = [];
    }
}
