import {createHashHistory, History} from "history";
import Constants from "./Constants";
import Routes, {Route} from "./Routes";
import Asset from "../model/Asset";
import Utils from "./Utils";
import VocabularyUtils from "./VocabularyUtils";
import Term from "../model/Term";

export class Routing {
    get history(): History {
        return this.mHistory;
    }

    private static setPathParams(path: string, params: Map<string, string>) {
        for (const pair of Array.from(params.entries())) {
            path = path.replace(":" + pair[0], pair[1]);
        }
        return path;
    }

    private static setQueryParams(path: string, params: Map<string, string>) {
        const paramValuePairs = Array.from(params.entries()).map((pair) => pair[0] + "=" + pair[1]);
        return paramValuePairs.length > 0 ? path + "?" + paramValuePairs.join("&") : path;
    }

    public static buildUrl(route: Route, options: { params?: Map<string, string>, query?: Map<string, string> } = {}) {
        let path = route.path;
        if (options.params) {
            path = Routing.setPathParams(path, options.params);
        }
        if (options.query) {
            path = Routing.setQueryParams(path, options.query);
        }
        return path;
    };

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
     * Creates the transition path to the specified route
     * @param route Route object
     * @param options Transition options, can specify path parameters and query parameters.
     */
    public static getTransitionPath = (route: Route, options: { params?: Map<string, string>, query?: Map<string, string> } = {}) => {
        return Routing.buildUrl(route, options);
    };

    /**
     * Transitions to the specified route
     * @param route Route object
     * @param options Transition options, can specify path parameters and query parameters.
     */
    public transitionTo = (route: Route, options: { params?: Map<string, string>, query?: Map<string, string> } = {}) => {
        this.mHistory.push(Routing.getTransitionPath(route, options));
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
    };

    /**
     * Transitions to the summary view of the specified asset.
     * @param asset Asset to transition to
     */
    public transitionToAsset = (asset: Asset) => {
        const primaryType = Utils.getPrimaryAssetType(asset);
        const iri = VocabularyUtils.create(asset.iri);
        switch (primaryType) {
            case VocabularyUtils.VOCABULARY:
                this.transitionTo(Routes.vocabularySummary, {
                    params: new Map([["name", iri.fragment]]),
                    query: new Map([["namespace", iri.namespace!]])
                });
                break;
            case VocabularyUtils.RESOURCE:
            case VocabularyUtils.DOCUMENT:
            case VocabularyUtils.FILE:
            case VocabularyUtils.DATASET:
                this.transitionTo(Routes.resourceSummary, {
                    params: new Map([["name", iri.fragment]]),
                    query: new Map([["namespace", iri.namespace!]])
                });
                break;
            case VocabularyUtils.TERM:
                const vocIri = VocabularyUtils.create((asset as Term).vocabulary!.iri!);
                this.transitionTo(Routes.vocabularyTermDetail, {
                    params: new Map([["name", vocIri.fragment], ["termName", iri.fragment]]),
                    query: new Map([["namespace", vocIri.namespace!]])
                });
                break;
        }
    };
}

const INSTANCE = new Routing();

export default INSTANCE;
