import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../../hoc/withI18n";
import {RouteComponentProps, withRouter} from "react-router";
import {connect} from "react-redux";
// import {Card, CardBody, CardHeader, Col, Row} from "reactstrap";
import SearchResult from "../../../model/SearchResult";
import './Search.scss';
import * as SearchActions from "../../../action/SearchActions";
// import Vocabulary from "../../../util/VocabularyUtils";
import {ThunkDispatch} from '../../../util/Types';
import {AbstractSearch} from "./AbstractSearch";
import TermItState from "../../../model/TermItState";
import SearchResultTerms from "./SearchResultTerms";
import SearchResultVocabularies from "./SearchResultVocabularies";
import SearchQuery from "../../../model/SearchQuery";
import Dashboard from "../../dashboard/Dashboard";
import Spinner from "../../Spinner";

interface SearchProps extends HasI18n, RouteComponentProps<any> {
    addSearchListener: () => void;
    removeSearchListener: () => void;
    searchQuery: SearchQuery;
    searchResults: SearchResult[] | null;
    searchInProgress: boolean;
}

interface SearchState {
}

export class Search extends AbstractSearch<SearchProps, SearchState> {

    public componentDidMount() {
        this.props.addSearchListener();
    }

    public componentWillUnmount() {
        this.props.removeSearchListener();
    }

    public render() {
        const i18n = this.props.i18n;

        const loading = this.props.searchInProgress ? <Spinner/> : null;

        if (!this.props.searchQuery || this.props.searchQuery.isEmpty()) {
            return <div>
                <Dashboard />
                {loading}
            </div>;
        } else {
            return <div>
                <h2 className='page-header'>{i18n('search.title')}</h2>
                <SearchResultVocabularies/>
                <SearchResultTerms/>
                {loading}
            </div>;
        }
    }

}

export default connect((state: TermItState) => {
    return {
        searchQuery: state.searchQuery,
        searchResults: state.searchResults,
        searchInProgress: state.searchInProgress,
    };
}, (dispatch: ThunkDispatch) => {
    return {
        addSearchListener: () => dispatch(SearchActions.addSearchListener()),
        removeSearchListener: () => dispatch(SearchActions.removeSearchListener()),
    };
})(withRouter(injectIntl(withI18n(Search))));
