import User, {EMPTY_USER} from "./User";
import ErrorInfo, {EMPTY_ERROR} from "./ErrorInfo";
import Message from "./Message";
import en from '../i18n/en';
import IntlData from "./IntlData";

/**
 * This is the basic shape of the application's state managed by Redux.
 */
export default class TermItState {
    public loading: boolean;
    public user: User;
    public error: ErrorInfo;
    public messages: Message[];
    public intl: IntlData;

    constructor() {
        this.loading = false;
        this.user = EMPTY_USER;
        this.error = EMPTY_ERROR;
        this.messages = [];
        this.intl = en;
    }
}
