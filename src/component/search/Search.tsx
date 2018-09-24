import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Input, InputGroup, InputGroupAddon, InputGroupText} from "reactstrap";
import {GoSearch} from "react-icons/go";
import './Search.scss';

interface SearchState {
    searchString: string
}

class Search extends React.Component<HasI18n, SearchState> {

    constructor(props: HasI18n) {
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
            <div>
                <InputGroup>
                    <Input type='search' placeholder={i18n('main.search.placeholder')} size={32} bsSize='sm'
                           value={this.state.searchString} onChange={this.onChange}/>
                    <InputGroupAddon addonType='append' className='search-icon' title={i18n('main.search.tooltip')}>
                        <InputGroupText>
                            <GoSearch/>
                        </InputGroupText>
                    </InputGroupAddon>
                </InputGroup>
            </div>
        </div>;
    }
}

export default injectIntl(withI18n(Search));