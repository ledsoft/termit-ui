import {History} from "history";
import {createBrowserHistory} from "history/createBrowserHistory";
import Constants from "./Constants";
import {Route} from "./Routes";

class Routing {
    get history(): History {
        return this.mHistory;
    }

    private static _setPathParams(path: string, params: {}) {
        for (const paramName in params) {
            if (params.hasOwnProperty(paramName)) {
                path = path.replace(':' + paramName, params[paramName]);
            }
        }
        return path;
    }


    private mHistory: History;
    private originalTarget: Route;

    constructor() {
        this.mHistory = createBrowserHistory();
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
     * @param options Transition options, can specify path parameters, query parameters, payload and view handlers.
     */
    public transitionTo = (route: Route, options = {}) => {
        let path = route.path;
        if (!options) {
            options = {};
        }
        if (options.params) {
            path = Routing._setPathParams(path, options.params);
        }
        // RouterStore.setTransitionPayload(route.name, options.payload);
        // RoutingRules.execute(route.name);
        this.mHistory.push(path);
    };

    public transitionToHome = (options: {}) => {
        this.transitionTo(Constants.HOME_ROUTE, options);
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
