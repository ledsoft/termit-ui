import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../../hoc/withI18n";
import {Input, InputGroup, InputGroupAddon, InputGroupText} from "reactstrap";
import {GoSearch} from "react-icons/go";
import './Search.scss';
import SearchResult from "../../../model/SearchResult";
import {connect} from "react-redux";
import TermItState from "../../../model/TermItState";
import {ThunkDispatch} from "redux-thunk";
import {Action} from "redux";
import {search} from "../../../action/AsyncActions";
import SearchResultsOverlay from "./SearchResultsOverlay";
import Routes from "../../../util/Routes";
import Routing from '../../../util/Routing';
import {clearSearchResults} from "../../../action/SyncActions";

interface SearchProps extends HasI18n {
    searchResults: SearchResult[] | null;
    search: (searchString: string) => void;
    clearSearch: () => void;
}

interface SearchState {
    searchString: string;
    showResults: boolean;
}

export class Search extends React.Component<SearchProps, SearchState> {

    constructor(props: SearchProps) {
        super(props);
        this.state = {
            searchString: '',
            showResults: false
        };
    }

    private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        this.setState({searchString: value, showResults: value.length > 0});
        this.search(value);
    };

    private search = (str?: string) => {
        const searchVal = str ? str : this.state.searchString;
        if (searchVal.trim().length > 0) {
            this.props.search(searchVal);
        }
    };

    private closeResults = () => {
        this.setState({showResults: false});
    };

    private clearInput = () => {
        this.setState({searchString: ''});
    };

    private openResult = (result: SearchResult) => {
        // TODO Open detail
        return null;
    };

    private openSearchView = () => {
        const searchString = this.state.searchString;
        Routing.transitionTo(Routes.search, {query: new Map([['searchString', encodeURI(searchString)]])});
        this.clearInput();
    };

    public render() {
        const i18n = this.props.i18n;
        return <div className='search'>
            <InputGroup>
                <Input type='search' id='main-search-input' placeholder={i18n('main.search.placeholder')}
                       bsSize='sm'
                       value={this.state.searchString} onChange={this.onChange}/>
                <InputGroupAddon addonType='append' className='search-icon' title={i18n('main.search.tooltip')}>
                    <InputGroupText>
                        <GoSearch onClick={this.openSearchView}/>
                    </InputGroupText>
                </InputGroupAddon>
            </InputGroup>
            {this.renderResults()}
        </div>;
    }

    private renderResults() {
        if (!this.props.searchResults) {
            return null;
        }
        return <SearchResultsOverlay show={this.state.showResults} searchResults={this.props.searchResults}
                                     onClose={this.closeResults} targetId='main-search-input'
                                     onClick={this.openResult} onOpenSearch={this.openSearchView}/>;
    }
}

export default connect((state: TermItState) => {
    return {
        searchResults: state.searchResults
    };
}, (dispatch: ThunkDispatch<object, undefined, Action>) => {
    return {
        search: (searchString: string) => dispatch(search(searchString, true)),
        clearSearch: () => dispatch(clearSearchResults())
    };
})(injectIntl(withI18n(Search)));