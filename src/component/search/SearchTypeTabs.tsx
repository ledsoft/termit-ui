import * as React from "react";
import * as SearchActions from "../../action/SearchActions";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {RouteComponentProps} from "react-router";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {ThunkDispatch} from "../../util/Types";
import TermItState from "../../model/TermItState";
import {Nav, NavItem, NavLink} from "reactstrap";
import SearchQuery from "../../model/SearchQuery";
import Routes, {Route} from "../../util/Routes";

interface SearchTypeTabsProps extends HasI18n, RouteComponentProps<any> {
    addSearchListener: () => void;
    removeSearchListener: () => void;
    searchQuery: SearchQuery;
}

export class SearchTypeTabs extends React.Component<SearchTypeTabsProps> {

    public componentDidMount() {
        this.props.addSearchListener();
    }

    public componentWillUnmount() {
        this.props.removeSearchListener();
    }

    public render() {
        const i18n = this.props.i18n;
        const path = this.props.location.pathname;

        const tabs: Array<{ route: Route, altExactRoutes: Route[], label: string, id: string }> = [{
            route: Routes.search,
            altExactRoutes: [],
            label: i18n("search.tab.everything"),
            id: "search-tab-everything"
        }, {
            route: Routes.searchTerms,
            altExactRoutes: [],
            label: i18n("search.tab.terms"), id: "search-tab-terms"
        }, {
            route: Routes.searchVocabularies,
            altExactRoutes: [],
            label: i18n("search.tab.vocabularies"),
            id: "search-tab-vocabularies"
        }, {
            route: Routes.facetedSearch,
            altExactRoutes: [],
            label: i18n("search.tab.facets"),
            id: "search-tab-facets"
        }];

        let activeTab: object | null = null;
        let activeTabDepth = -1;

        // Find active tab using exact matches
        altExactRoutesLoop: for (const tab of tabs) {
            for (const altExactRoute of tab.altExactRoutes) {
                if (path === altExactRoute.path) {
                    activeTab = tab;
                    break altExactRoutesLoop;
                }
            }
        }

        // Find an active tab
        if (!activeTab) {
            for (const tab of tabs) {
                const isActive = (path === tab.route.path || path.startsWith(tab.route.path + "/"));
                const slashes = tab.route.path.match("/");
                const depth = slashes ? slashes.length : 0;
                if (isActive && depth >= activeTabDepth) {
                    activeTab = tab;
                    activeTabDepth = depth;
                }
            }
        }

        if (activeTab !== null) {
            return <div><Nav tabs={true} className="justify-content-center">
                {tabs.map((tab) => (
                    <NavItem key={tab.route.name}>
                        <NavLink id={tab.id} active={tab === activeTab} href={"#" + tab.route.link()}>{tab.label}</NavLink>
                    </NavItem>)
                )}
            </Nav></div>;
        } else {
            return null;
        }
    }

}

export default withRouter(connect((state: TermItState) => {
    return {
        searchQuery: state.searchQuery,
        intl: state.intl
    };
}, (dispatch: ThunkDispatch) => {
    return {
        addSearchListener: () => dispatch(SearchActions.addSearchListener()),
        removeSearchListener: () => dispatch(SearchActions.removeSearchListener()),
    };
})(injectIntl(withI18n(SearchTypeTabs))));
