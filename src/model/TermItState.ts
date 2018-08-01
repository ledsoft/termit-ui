import Constants from "../util/Constants";

export default class TermItState {
    public loading: boolean;
    public user?: object;
    public error?: object;

    constructor() {
        this.loading = false;
        this.user = Constants.NULL;
        this.error = Constants.NULL;
    }
}
