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

        const tabs: Array<{route: Route, altExactRoutes: Route[], label: string}> = [
            { route: Routes.dashboard, altExactRoutes: [], label: i18n("search.tab.dashboard") },
            { route: Routes.search, altExactRoutes: [], label: i18n("search.tab.everything") },
            { route: Routes.searchTerms, altExactRoutes: [], label: i18n("search.tab.terms") },
            { route: Routes.facetedSearch, altExactRoutes: [], label: i18n("search.tab.facets") },
        ];

        let activeTab: object|null = null;
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
            return <Nav tabs={true}>
                {tabs.map((tab) => (
                    <NavItem key={tab.route.name}>
                        <NavLink active={tab === activeTab} href={"#" + tab.route.link()}>{tab.label}</NavLink>
                    </NavItem>)
                )}
            </Nav>;
        } else {
            return this.props.children;
        }
    }

}

export default withRouter(connect((state: TermItState) => {
    return {
        searchQuery: state.searchQuery,
    };
}, (dispatch: ThunkDispatch) => {
    return {
        addSearchListener: () => dispatch(SearchActions.addSearchListener()),
        removeSearchListener: () => dispatch(SearchActions.removeSearchListener()),
    };
})(injectIntl(withI18n(SearchTypeTabs))));
