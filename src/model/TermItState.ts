import User, {EMPTY_USER} from "./User";
import ErrorInfo, {EMPTY_ERROR} from "./ErrorInfo";
import Message from "./Message";
import en from '../i18n/en';
import IntlData from "./IntlData";
import Vocabulary, {EMPTY_VOCABULARY} from "./Vocabulary";
import {QueryResultIF} from "./QueryResult";
import Term from "./Term";
import Document, {EMPTY_DOCUMENT} from "./Document";

/**
 * This is the basic shape of the application's state managed by Redux.
 */
export default class TermItState {
    public loading: boolean;
    public user: User;
    public vocabulary: Vocabulary;
    public defaultTerms: Term[];
    public vocabularies: { [key: string]: Vocabulary };
    public document: Document;
    public fileIri: string | null;
    public fileContent: string | null;
    public error: ErrorInfo;
    public messages: Message[];
    public intl: IntlData;
    public selectedTerm: Term | null;
    public queryResults: { [key: string]: QueryResultIF };
    public createdTermsCounter: number;
    public facetedSearchResult: object;
    public searchQuery: string;
    public types: { [key: string]: Term };

    // FIXME: WTF: This constructor is never called?
    constructor() {
        this.loading = false;
        this.user = EMPTY_USER;
        this.vocabulary = EMPTY_VOCABULARY;
        this.defaultTerms = [];
        this.vocabularies = {};
        this.document = EMPTY_DOCUMENT;
        this.fileIri = null;
        this.fileContent = null;
        this.error = EMPTY_ERROR;
        this.messages = [];
        this.intl = en;
        this.selectedTerm = null;
        this.queryResults = {};
        this.createdTermsCounter = 0;
        this.facetedSearchResult = {};
        this.searchQuery = '';
        this.types = {};
    }
}
