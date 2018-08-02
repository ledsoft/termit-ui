import User, {EMPTY_USER} from "./User";
import ErrorInfo, {EMPTY_ERROR} from "./ErrorInfo";

/**
 * This is the basic shape of the application's state managed by Redux.
 */
export default class TermItState {
    public loading: boolean;
    public user: User;
    public error: ErrorInfo;

    constructor() {
        this.loading = false;
        this.user = EMPTY_USER;
        this.error = EMPTY_ERROR;
    }
}
