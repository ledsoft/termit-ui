import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../../hoc/withI18n";
import {Button, Input, InputGroup, InputGroupAddon} from "reactstrap";
import {GoSearch} from "react-icons/go";
import "./NavbarSearch.scss";
import SearchResult from "../../../model/SearchResult";
import {connect} from "react-redux";
import {updateSearchFilter} from "../../../action/SearchActions";
import SearchResultsOverlay from "./SearchResultsOverlay";
import Routes from "../../../util/Routes";
import {ThunkDispatch} from "../../../util/Types";
import TermItState from "../../../model/TermItState";
import Routing from "../../../util/Routing";
import {RouteComponentProps, withRouter} from "react-router";

interface NavbarSearchProps extends HasI18n, RouteComponentProps<any> {
    updateSearchFilter: (searchString: string) => any;
    searchString: string;
    searchResults: SearchResult[] | null;
}

interface NavbarSearchState {
    showResults: boolean;
}

export class NavbarSearch extends React.Component<NavbarSearchProps, NavbarSearchState> {

    constructor(props: NavbarSearchProps) {
        super(props);
        this.state = {
            showResults: false
        };
    }

    private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        this.closeResults();
        this.props.updateSearchFilter(value).then(() => this.setState({showResults: true}));
    };

    private onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            this.openSearchView();
        }
    };

    // TODO Close results when transitioning to a different path

    private openSearchView = () => {
        const query = new Map();
        const searchString = this.props.searchString.trim();
        if (searchString.length > 0) {
            query.set("searchString", encodeURI(searchString));
        }
        this.closeResults();
        Routing.transitionTo(Routes.search, {query});
    };

    private closeResults = () => {
        this.setState({showResults: false});
    };

    private displayResults() {
        const path = this.props.location.pathname;
        return this.state.showResults && path !== Routes.search.path && path !== Routes.searchTerms.path && path !== Routes.searchVocabularies.path;
    }

    public render() {
        const i18n = this.props.i18n;
        return <div className="search flex-grow-1">
            <InputGroup>
                <Input type="search" id="main-search-input" placeholder={i18n("main.search.placeholder")}
                       autoFocus={true} autoComplete="off"
                       value={this.props.searchString} onChange={this.onChange} onKeyPress={this.onKeyPress}/>
                <InputGroupAddon addonType="append" className="search-icon" title={i18n("main.search.tooltip")}>
                    <Button id="main-search-icon-button" onClick={this.openSearchView}>
                        <GoSearch/>
                    </Button>
                </InputGroupAddon>
            </InputGroup>
            {this.renderResultsOverlay()}
        </div>;
    }

    private renderResultsOverlay() {
        if (!this.props.searchResults) {
            return null;
        } else {
            return <SearchResultsOverlay show={this.displayResults()} searchResults={this.props.searchResults}
                                         onClose={this.closeResults} targetId="main-search-input"
                                         onOpenSearch={this.openSearchView}/>;
        }
    }

}

export default withRouter(connect((state: TermItState) => {
    return {
        searchString: state.searchQuery.searchQuery,
        searchResults: state.searchResults,
        intl: state.intl        // Pass intl in props to force UI re-render on language switch
    };
}, (dispatch: ThunkDispatch) => {
    return {
        updateSearchFilter: (searchString: string) => dispatch(updateSearchFilter(searchString))
    };
})(injectIntl(withI18n(NavbarSearch))));
