import * as React from 'react';
import * as SearchActions from "../../action/SearchActions";
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {RouteComponentProps} from "react-router";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {ThunkDispatch} from '../../util/Types';
import TermItState from "../../model/TermItState";
import {Nav, NavItem, NavLink} from "reactstrap";
import SearchQuery from "../../model/SearchQuery";
import Routes from "../../util/Routes";

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

        const tabs = [
            { route: Routes.search, label: i18n('search.tab.everything') },
            { route: Routes.searchTerms, label: i18n('search.tab.terms') },
            { route: Routes.facetedSearch, label: i18n('search.tab.facets') },
        ];

        // Find an active tab
        let activeTab: object|null = null;
        let activeTabDepth = -1;
        for (const tab of tabs) {
            const isActive = (path === tab.route.path || path.startsWith(tab.route.path + "/"));
            const slashes = tab.route.path.match('/');
            const depth = slashes ? slashes.length : 0;
            if (isActive && depth >= activeTabDepth) {
                activeTab = tab;
                activeTabDepth = depth;
            }
        }

        if (activeTab !== null) {
            return <Nav tabs={true}>
                {tabs.map((tab) => (
                    <NavItem>
                        <NavLink active={tab === activeTab} href={'#' + tab.route.link()}>{tab.label}</NavLink>
                    </NavItem>)
                )}
            </Nav>;
        } else {
            return null;
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
