import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../../hoc/withI18n";
import {Input, InputGroup, InputGroupAddon, Button} from "reactstrap";
import {GoSearch} from "react-icons/go";
import './NavbarSearch.scss';
import {connect} from "react-redux";
import {search, updateSearchFilter} from "../../../action/SearchActions";
import Routes from "../../../util/Routes";
import Routing from '../../../util/Routing';
import {ThunkDispatch} from '../../../util/Types';
import {AbstractSearch} from "./AbstractSearch";
import TermItState from "../../../model/TermItState";

interface NavbarSearchProps extends HasI18n {
    search: (searchString: string) => any;
    updateSearchFilter: (searchString: string) => any;
    searchString: string;
}

interface NavbarSearchState {
}

export class NavbarSearch extends AbstractSearch<NavbarSearchProps, NavbarSearchState> {

    private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        this.props.updateSearchFilter(value);
    };

    private onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            this.openSearchView();
            this.setState({results: []});
        }
    };

    private openSearchView = () => {
        const query = new Map();
        const searchString = this.props.searchString.trim();
        if (searchString.length > 0) {
            query.set('searchString', encodeURI(searchString));
        }
        Routing.transitionTo(Routes.search, {query});
    };

    public render() {
        const i18n = this.props.i18n;
        return <div className='search flex-grow-1'>
            <InputGroup>
                <Input type='search' id='main-search-input' placeholder={i18n('main.search.placeholder')}
                       autoFocus={true} autocomplete="off"
                       value={this.props.searchString} onChange={this.onChange} onKeyPress={this.onKeyPress}/>
                <InputGroupAddon addonType='append' className='search-icon' title={i18n('main.search.tooltip')}>
                    <Button color="grey" onClick={this.openSearchView}>
                        <GoSearch/>
                    </Button>
                </InputGroupAddon>
            </InputGroup>
        </div>;
    }

}

export default connect((state: TermItState) => {
    return {
        searchString: state.searchQuery.searchQuery
    };
}, (dispatch: ThunkDispatch) => {
    return {
        search: (searchString: string) => dispatch(search(searchString, true)),
        updateSearchFilter: (searchString: string) => dispatch(updateSearchFilter(searchString)),
    };
})(injectIntl(withI18n(NavbarSearch)));
