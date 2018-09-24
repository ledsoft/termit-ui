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

interface SearchProps extends HasI18n {
    searchResults: SearchResult[] | null;
    search: (searchString: string) => void;
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
            showResults: true
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

    private openResult = (result: SearchResult) => {
        // TODO Open detail
        return null;
    };

    public render() {
        const i18n = this.props.i18n;
        return <div className='search'>
            <InputGroup>
                <Input type='search' id='main-search-input' placeholder={i18n('main.search.placeholder')} size={32}
                       bsSize='sm'
                       value={this.state.searchString} onChange={this.onChange}/>
                <InputGroupAddon addonType='append' className='search-icon' title={i18n('main.search.tooltip')}>
                    <InputGroupText>
                        <GoSearch/>
                    </InputGroupText>
                </InputGroupAddon>
            </InputGroup>
            {this.renderResults()}
        </div>;
    }

    private renderResults() {
        if (!this.props.searchResults || !this.state.showResults) {
            return null;
        }
        return <SearchResultsOverlay searchResults={this.props.searchResults} onClose={this.closeResults}
                                     targetId='main-search-input' onClick={this.openResult}/>;
    }
}

export default connect((state: TermItState) => {
    return {
        searchResults: state.searchResults
    };
}, (dispatch: ThunkDispatch<object, undefined, Action>) => {
    return {
        search: (searchString: string) => dispatch(search(searchString, true))
    };
})(injectIntl(withI18n(Search)));