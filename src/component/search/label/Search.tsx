import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../../hoc/withI18n";
import {RouteComponentProps, withRouter} from "react-router";
import {connect} from "react-redux";
import SearchResult from "../../../model/SearchResult";
import "./Search.scss";
import * as SearchActions from "../../../action/SearchActions";
import {ThunkDispatch} from "../../../util/Types";
import TermItState from "../../../model/TermItState";
import SearchQuery from "../../../model/SearchQuery";
import Dashboard from "../../dashboard/Dashboard";
import Spinner from "../../Spinner";
import SearchResults from "./SearchResults";

interface SearchProps extends HasI18n, RouteComponentProps<any> {
    addSearchListener: () => void;
    removeSearchListener: () => void;
    searchQuery: SearchQuery;
    searchResults: SearchResult[] | null;
    searchInProgress: boolean;
}

export class Search extends React.Component<SearchProps> {

    constructor(props: SearchProps) {
        super(props);
    }

    public componentDidMount() {
        this.props.addSearchListener();
    }

    public componentWillUnmount() {
        this.props.removeSearchListener();
    }

    public render() {
        const loading = this.props.searchInProgress ? <Spinner/> : null;

        if (!this.props.searchQuery || this.props.searchQuery.isEmpty()) {
            return <>
                <Dashboard />
                {loading}
            </>;
        } else if (this.props.searchResults) {
            return <>
                <h2>{this.props.formatMessage("search.results.title", {searchString: this.props.searchQuery.searchQuery})}</h2>
                <SearchResults results={this.props.searchResults} />
                {loading}
            </>;
        } else {
            return loading;
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
