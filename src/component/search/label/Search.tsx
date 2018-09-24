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

interface SearchProps extends HasI18n {
    searchResults: SearchResult[]
}

interface SearchState {
    searchString: string
}

class Search extends React.Component<SearchProps, SearchState> {

    constructor(props: SearchProps) {
        super(props);
        this.state = {
            searchString: ''
        };
    }

    private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({searchString: e.target.value});
    };

    public render() {
        const i18n = this.props.i18n;
        return <div className='search'>
            <InputGroup>
                <Input type='search' placeholder={i18n('main.search.placeholder')} size={32} bsSize='sm'
                       value={this.state.searchString} onChange={this.onChange}/>
                <InputGroupAddon addonType='append' className='search-icon' title={i18n('main.search.tooltip')}>
                    <InputGroupText>
                        <GoSearch/>
                    </InputGroupText>
                </InputGroupAddon>
            </InputGroup>
        </div>;
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