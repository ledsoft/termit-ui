import {createHashHistory, History} from "history";
import Constants from "./Constants";
import {Route} from "./Routes";

class Routing {
    get history(): History {
        return this.mHistory;
    }

    private static setPathParams(path: string, params: Map<string, string>) {
        for (const pair of Array.from(params.entries())) {
            path = path.replace(':' + pair[0], pair[1]);
        }
        return path;
    }

    private static setQueryParams(path: string, params: Map<string, string>) {
        const paramValuePairs = Array.from(params.entries()).map((pair) => pair[0] + "=" + pair[1]);
        return paramValuePairs.length > 0 ? path + '?' + paramValuePairs.join('&') : path;
    }


    private readonly mHistory: History;
    private originalTarget: Route;

    constructor() {
        this.mHistory = createHashHistory();
    }

    public saveOriginalTarget = (route: Route) => {
        if (!route) {
            return;
        }
        this.originalTarget = route;
    };

    /**
     * Transitions to the specified route
     * @param route Route object
     * @param options Transition options, can specify path parameters and query parameters.
     */
    public transitionTo = (route: Route, options: { params?: Map<string, string>, query?: Map<string, string> } = {}) => {
        let path = route.path;
        if (options.params) {
            path = Routing.setPathParams(path, options.params);
        }
        if (options.query) {
            path = Routing.setQueryParams(path, options.query);
        }
        this.mHistory.push(path);
    };

    public transitionToHome = () => {
        this.transitionTo(Constants.HOME_ROUTE);
    };

    public transitionToOriginalTarget = () => {
        if (this.originalTarget && this.originalTarget.path) {
            this.transitionTo(this.originalTarget);
        } else {
            this.transitionTo(Constants.HOME_ROUTE);
        }
    }
}

const INSTANCE = new Routing();

export default INSTANCE;
