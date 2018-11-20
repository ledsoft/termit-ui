import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../../hoc/withI18n";
import {Input, InputGroup, InputGroupAddon, Button} from "reactstrap";
import {GoSearch} from "react-icons/go";
import './NavbarSearch.scss';
import SearchResult from "../../../model/SearchResult";
import {connect} from "react-redux";
import {search, updateSearchFilter} from "../../../action/AsyncActions";
import SearchResultsOverlay from "./SearchResultsOverlay";
import Routes from "../../../util/Routes";
import Routing from '../../../util/Routing';
import Vocabulary from "../../../util/VocabularyUtils";
import {ThunkDispatch} from '../../../util/Types';
import TermItState from "../../../model/TermItState";

interface NavbarSearchProps extends HasI18n {
    search: (searchString: string) => Promise<object>;
    updateSearchFilter: (searchString: string) => any;
    searchString: string;
}

interface NavbarSearchState {
    showResults: boolean;
    results: SearchResult[] | null;
}

export class NavbarSearch extends React.Component<NavbarSearchProps, NavbarSearchState> {

    constructor(props: NavbarSearchProps) {
        super(props);
        this.state = {
            showResults: false,
            results: null
        };
    }

    private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        this.props.updateSearchFilter(value);
        this.setState({showResults: value.length > 0});
        if (value.length > 0) {
            this.props.search(value).then((data: SearchResult[]) => this.setState({results: data}));
        }
    };

    private onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            this.openSearchView();
        }
    };

    private closeResults = () => {
        this.setState({showResults: false});
    };

    private clear = () => {
        this.setState({results: null});
    };

    public openResult = (result: SearchResult) => {
        this.clear();
        if (result.types.indexOf(Vocabulary.VOCABULARY) !== -1) {
            Routing.transitionTo(Routes.vocabularyDetail, {params: new Map([['name', Vocabulary.getFragment(result.iri)]])});
        } else {
            // TODO Transition to term otherwise (once term detail is implemented)
            Routing.transitionTo(Routes.vocabularyDetail, {params: new Map([['name', Vocabulary.getFragment(result.vocabularyIri!)]])});
        }
    };

    private openSearchView = () => {
        const query = new Map();
        const searchString = this.props.searchString.trim();
        if (searchString.length > 0) {
            query.set('searchString', encodeURI(searchString));
        }
        Routing.transitionTo(Routes.search, {query});
        this.clear();
    };

    public render() {
        const i18n = this.props.i18n;
        return <div className='search flex-grow-1'>
            <InputGroup>
                <Input type='search' id='main-search-input' placeholder={i18n('main.search.placeholder')}
                       value={this.props.searchString} onChange={this.onChange} onKeyPress={this.onKeyPress}/>
                <InputGroupAddon addonType='append' className='search-icon' title={i18n('main.search.tooltip')}>
                    <Button color="grey" onClick={this.openSearchView}>
                        <GoSearch/>
                    </Button>
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

export default connect((state: TermItState) => {
    return {
        searchString: state.searchQuery
    };
}, (dispatch: ThunkDispatch) => {
    return {
        search: (searchString: string) => dispatch(search(searchString, true)),
        updateSearchFilter: (searchString: string) => dispatch(updateSearchFilter(searchString)),
    };
})(injectIntl(withI18n(NavbarSearch)));
