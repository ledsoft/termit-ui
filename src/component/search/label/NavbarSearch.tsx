import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../../hoc/withI18n";
import {Input, InputGroup, InputGroupAddon, InputGroupText} from "reactstrap";
import {GoSearch} from "react-icons/go";
import './NavbarSearch.scss';
import SearchResult from "../../../model/SearchResult";
import {connect} from "react-redux";
import {search} from "../../../action/AsyncActions";
import SearchResultsOverlay from "./SearchResultsOverlay";
import Routes from "../../../util/Routes";
import Routing from '../../../util/Routing';
import {ThunkDispatch} from '../../../util/Types';
import {AbstractSearch, SearchState} from "./AbstractSearch";

interface NavbarSearchProps extends HasI18n {
    search: (searchString: string) => Promise<object>;
}

interface NavbarSearchState extends SearchState {
    showResults: boolean;
}

export class NavbarSearch extends AbstractSearch<NavbarSearchProps, NavbarSearchState> {

    constructor(props: NavbarSearchProps) {
        super(props);
        this.state = {
            searchString: '',
            showResults: false,
            results: null
        };
    }

    private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        this.setState({searchString: value, showResults: value.length > 0});
        this.search(value);
    };

    public search = (str?: string) => {
        const searchVal = str ? str : this.state.searchString;
        if (searchVal.trim().length > 0) {
            this.props.search(searchVal).then((data: SearchResult[]) => this.setState({results: data}));
        }
    };

    private closeResults = () => {
        this.setState({showResults: false});
    };

    private openSearchView = () => {
        const query = new Map();
        if (this.state.searchString.trim().length > 0) {
            query.set('searchString', encodeURI(this.state.searchString));
        }
        Routing.transitionTo(Routes.search, {query});
        this.clear();
    };

    public render() {
        const i18n = this.props.i18n;
        return <div className='search'>
            <InputGroup>
                <Input type='search' id='main-search-input' placeholder={i18n('main.search.placeholder')} bsSize='sm'
                       value={this.state.searchString} onChange={this.onChange}/>
                <InputGroupAddon addonType='append' className='search-icon' title={i18n('main.search.tooltip')}>
                    <InputGroupText>
                        <GoSearch onClick={this.openSearchView}/>
                    </InputGroupText>
                </InputGroupAddon>
            </InputGroup>
            {this.renderResultsOverlay()}
        </div>;
    }

    private renderResultsOverlay() {
        if (this.state.results === null) {
            return null;
        } else {
            return <SearchResultsOverlay show={this.state.showResults} searchResults={this.state.results}
                                         onClose={this.closeResults} targetId='main-search-input'
                                         onClick={this.openResult} onOpenSearch={this.openSearchView}/>;
        }
    }
}

export default connect(undefined, (dispatch: ThunkDispatch) => {
    return {
        search: (searchString: string) => dispatch(search(searchString, true))
    };
})(injectIntl(withI18n(NavbarSearch)));