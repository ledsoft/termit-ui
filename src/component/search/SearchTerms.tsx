import * as React from 'react';
import * as SearchActions from "../../action/SearchActions";
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {RouteComponentProps} from "react-router";
import {connect} from "react-redux";
import {ThunkDispatch} from '../../util/Types';
import TermItState from "../../model/TermItState";
import SearchQuery from "../../model/SearchQuery";

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
        // const i18n = this.props.i18n;

        if (this.props.searchQuery && this.props.searchQuery.searchQuery !== "") {
            return <div>Searching for “{this.props.searchQuery.searchQuery}”.</div>;
        } else {
            return <div>Searching for something.</div>;
        }
    }

}

export default connect((state: TermItState) => {
    return {
        searchQuery: state.searchQuery,
    };
}, (dispatch: ThunkDispatch) => {
    return {
        addSearchListener: () => dispatch(SearchActions.addSearchListener()),
        removeSearchListener: () => dispatch(SearchActions.removeSearchListener()),
    };
})(injectIntl(withI18n(SearchTypeTabs)));
