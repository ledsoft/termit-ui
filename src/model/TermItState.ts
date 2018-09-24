import User, {EMPTY_USER} from "./User";
import ErrorInfo, {EMPTY_ERROR} from "./ErrorInfo";
import Message from "./Message";
import en from '../i18n/en';
import IntlData from "./IntlData";
import Vocabulary, {EMPTY_VOCABULARY} from "./Vocabulary";
import {QueryResultIF} from "./QueryResult";
import VocabularyTerm from "./VocabularyTerm";
import SearchResult from "./SearchResult";

/**
 * This is the basic shape of the application's state managed by Redux.
 */
export default class TermItState {
    public loading: boolean;
    public user: User;
    public vocabulary: Vocabulary;
    public defaultTerms: VocabularyTerm[];
    public vocabularies: {[key:string]: Vocabulary};
    public error: ErrorInfo;
    public messages: Message[];
    public intl: IntlData;
    public selectedTerm: VocabularyTerm | null;
    public queryResults: {[key: string] : QueryResultIF};
    public searchResults: SearchResult[] | null;

    constructor() {
        this.loading = false;
        this.user = EMPTY_USER;
        this.vocabulary = EMPTY_VOCABULARY;
        this.defaultTerms = [];
        this.vocabularies = {};
        this.error = EMPTY_ERROR;
        this.messages = [];
        this.intl = en;
        this.selectedTerm = null;
        this.queryResults = {};
        // Null means initial state before any search, empty array means search without results
        this.searchResults = null;
    }
}
