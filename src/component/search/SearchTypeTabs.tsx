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
            { route: Routes.search, label: i18n('search.tab.everything'), isActive: false },
            { route: Routes.facetedSearch, label: i18n('search.tab.facets'), isActive: false }
        ];

        // Find an active tab
        let isSometingActive = false;
        for (const tab of tabs) {
            tab.isActive = path.startsWith(tab.route.path);
            if (tab.isActive) {
                isSometingActive = true;
            }
        }

        if (isSometingActive) {
            return <Nav tabs={true}>
                {tabs.map((tab) => (
                    <NavItem>
                        <NavLink active={tab.isActive} href={'#' + tab.route.link()}>{tab.label}</NavLink>
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
