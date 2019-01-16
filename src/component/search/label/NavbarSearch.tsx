import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../../hoc/withI18n";
import {Button, Input, InputGroup, InputGroupAddon} from "reactstrap";
import {GoSearch} from "react-icons/go";
import "./NavbarSearch.scss";
import SearchResult from "../../../model/SearchResult";
import {connect} from "react-redux";
import {autocompleteSearch, updateSearchFilter} from "../../../action/SearchActions";
import SearchResultsOverlay from "./SearchResultsOverlay";
import Routes from "../../../util/Routes";
import {ThunkDispatch} from "../../../util/Types";
import TermItState from "../../../model/TermItState";
import Routing from "../../../util/Routing";

interface NavbarSearchProps extends HasI18n {
    autocompleteSearch: (searchString: string) => any;
    updateSearchFilter: (searchString: string) => any;
    searchString: string;
}

interface NavbarSearchState {
    searchString: string;
    results: SearchResult[] | null;
    showResults: boolean;
}

export class NavbarSearch extends React.Component<NavbarSearchProps, NavbarSearchState> {

    constructor(props: NavbarSearchProps) {
        super(props);
        this.state = {
            searchString: "",
            showResults: false,
            results: null
        };
    }

    private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        this.props.updateSearchFilter(value);
        this.autocompleteSearch(value);
    };

    private onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            this.openSearchView();
        }
    };

    private openSearchView = () => {
        const query = new Map();
        const searchString = this.props.searchString.trim();
        if (searchString.length > 0) {
            query.set("searchString", encodeURI(searchString));
        }
        this.setState({results: [], showResults: false});
        Routing.transitionTo(Routes.search, {query});
    };

    public autocompleteSearch = (str?: string) => {
        const searchVal = str ? str : this.state.searchString;
        if (searchVal.trim().length > 0) {
            this.setState({results: [], showResults: false});
            this.props.autocompleteSearch(searchVal).then((data: SearchResult[]) => this.setState({
                results: data,
                showResults: true
            }));
        }
    };

    private closeResults = () => {
        this.setState({showResults: false});
    };

    public render() {
        const i18n = this.props.i18n;
        return <div className="search flex-grow-1">
            <InputGroup>
                <Input type="search" id="main-search-input" placeholder={i18n("main.search.placeholder")}
                       autoFocus={true} autoComplete="off"
                       value={this.props.searchString} onChange={this.onChange} onKeyPress={this.onKeyPress}/>
                <InputGroupAddon addonType="append" className="search-icon" title={i18n("main.search.tooltip")}>
                    <Button color="grey" onClick={this.openSearchView}>
                        <GoSearch/>
                    </Button>
                </InputGroupAddon>
            </InputGroup>
            {this.renderResultsOverlay()}
        </div>;
    }

    private renderResultsOverlay() {
        if (!this.state.results) {
            return null;
        } else {
            return <SearchResultsOverlay show={this.state.showResults} searchResults={this.state.results}
                                         onClose={this.closeResults} targetId="main-search-input"
                                         onOpenSearch={this.openSearchView}/>;
        }
    }

}

export default connect((state: TermItState) => {
    return {
        searchString: state.searchQuery.searchQuery,
        intl: state.intl        // Pass intl in props to force UI re-render on language switch
    };
}, (dispatch: ThunkDispatch) => {
    return {
        autocompleteSearch: (searchString: string) => dispatch(autocompleteSearch(searchString, true)),
        updateSearchFilter: (searchString: string) => dispatch(updateSearchFilter(searchString)),
    };
})(injectIntl(withI18n(NavbarSearch)));
