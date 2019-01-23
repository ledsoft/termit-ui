import * as React from "react";
import * as SearchActions from "../../action/SearchActions";
import {injectIntl} from "react-intl";
import withI18n from "../hoc/withI18n";
import {connect} from "react-redux";
import {ThunkDispatch} from "../../util/Types";
import TermItState from "../../model/TermItState";
import ContainerMask, {Search} from "./label/Search";
import {Button} from "reactstrap";
import {GoTrashcan} from "react-icons/go";
import SearchResult from "../../model/SearchResult";
import VocabularyUtils from "../../util/VocabularyUtils";
import SearchResults from "./label/SearchResults";

export class SearchTypeTabs extends Search {

    private getResults(): SearchResult[] | null {
        return this.props.searchResults ? this.props.searchResults.filter(r => r.hasType(VocabularyUtils.TERM)) : null;
    }

    public render() {
        const loading = this.props.searchInProgress ? <ContainerMask/> : null;
        const results = this.getResults();

        if (results) {
            return <div className="relative">
                <Button name="search-reset" color="danger" outline={true} size="sm" className="float-right" onClick={this.resetSearch}>
                    <GoTrashcan/> {this.props.i18n("search.reset")}
                </Button>
                <h2>{this.props.formatMessage("search.results.title", {searchString: this.props.searchQuery.searchQuery})}</h2>
                <SearchResults results={results}/>
                {loading}
            </div>;
        } else {
            return <div className="relative">{loading}</div>;
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
        updateSearchFilter: (searchString: string) => dispatch(SearchActions.updateSearchFilter(searchString)),
        addSearchListener: () => dispatch(SearchActions.addSearchListener()),
        removeSearchListener: () => dispatch(SearchActions.removeSearchListener()),
    };
})(injectIntl(withI18n(SearchTypeTabs)));
