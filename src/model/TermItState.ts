import User, {EMPTY_USER} from "./User";
import ErrorInfo, {EMPTY_ERROR} from "./ErrorInfo";
import Message from "./Message";
import en from "../i18n/en";
import IntlData from "./IntlData";
import Vocabulary, {EMPTY_VOCABULARY} from "./Vocabulary";
import {QueryResultIF} from "./QueryResult";
import Term from "./Term";
import Document, {EMPTY_DOCUMENT} from "./Document";
import Resource, {EMPTY_RESOURCE} from "./Resource";
import RdfsResource from "./RdfsResource";
import AppNotification from "./AppNotification";
import SearchResult from "./SearchResult";
import SearchQuery from "./SearchQuery";

/**
 * This is the basic shape of the application"s state managed by Redux.
 */
export default class TermItState {
    public loading: boolean;
    public user: User;
    public vocabulary: Vocabulary;
    public resources: { [key: string]: Resource };
    public resource: Resource;
    public defaultTerms: Term[];
    public vocabularies: { [key: string]: Vocabulary };
    public document: Document;
    public fileContent: string | null;
    public error: ErrorInfo;
    public messages: Message[];
    public intl: IntlData;
    public selectedTerm: Term | null;
    public queryResults: { [key: string]: QueryResultIF };
    public createdTermsCounter: number;
    public facetedSearchResult: object;
    public searchListenerCount: number;
    public searchInProgress: boolean;
    public searchQuery: SearchQuery;
    public searchResults: SearchResult[] | null;
    public types: { [key: string]: Term };
    public properties: RdfsResource[];
    // Represents a queue of inter-component notifications
    public notifications: AppNotification[];

    constructor() {
        this.loading = false;
        this.user = EMPTY_USER;
        this.vocabulary = EMPTY_VOCABULARY;
        this.resource = EMPTY_RESOURCE;
        this.resources = {};
        this.defaultTerms = [];
        this.vocabularies = {};
        this.document = EMPTY_DOCUMENT;
        this.fileContent = null;
        this.error = EMPTY_ERROR;
        this.messages = [];
        this.intl = en;
        this.selectedTerm = null;
        this.queryResults = {};
        this.createdTermsCounter = 0;
        this.facetedSearchResult = {};
        this.searchListenerCount = 0;
        this.searchInProgress = false;
        this.searchQuery = new SearchQuery();
        this.searchResults = null;
        this.types = {};
        this.properties = [];
        this.notifications = [];
    }
}
