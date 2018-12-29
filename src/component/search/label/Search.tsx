import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../../hoc/withI18n";
import {RouteComponentProps, withRouter} from "react-router";
import {connect} from "react-redux";
import {Button, Col, Form, FormGroup, Input, Row} from "reactstrap";
import SearchResult from "../../../model/SearchResult";
import './Search.scss';
import {search} from "../../../action/AsyncActions";
import {ThunkDispatch} from '../../../util/Types';
import {AbstractSearch} from "./AbstractSearch";
import Utils from "../../../util/Utils";
import SearchResults from "./SearchResults";

interface SearchProps extends HasI18n, RouteComponentProps<any> {
    search: (searchString: string) => Promise<object>;
}

export class Search extends AbstractSearch<SearchProps> {

    constructor(props: SearchProps) {
        super(props);
        this.state = {
            searchString: '',
            results: null
        };
    }

    public componentDidMount() {
        const searchString = Utils.extractQueryParam(this.props.location.search, 'searchString');
        if (searchString) {
            this.setState({searchString});
            this.search(searchString);
        }
    }

    private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        this.setState({searchString: value});
    };

    private onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            this.search(this.state.searchString);
        }
    };

    private onClick = () => {
        this.search(this.state.searchString);
    };

    public search = (searchString: string) => {
        if (searchString.trim().length > 0) {
            this.props.search(searchString).then((data: SearchResult[]) => this.setState({results: data}));
        }
    };

    public render() {
        const i18n = this.props.i18n;
        return <div>
            <h2 className='page-header'>{i18n('search.title')}</h2>
            <Row>
                <Col md={4}>
                    <Form inline={true}>
                        <FormGroup className='mb-2 mr-sm-2 search-input-container'>
                            <Input type='search' bsSize='sm' className='search-input' value={this.state.searchString}
                                   onChange={this.onChange} onKeyPress={this.onKeyPress}/>
                        </FormGroup>
                        <div className='mb-2'>
                            <Button size='sm' color='primary' onClick={this.onClick}>{i18n('search.title')}</Button>
                        </div>
                    </Form>
                </Col>
            </Row>
            <Row>
                {this.renderResults()}
            </Row>
        </div>;
    }

    private renderResults() {
        if (this.state.results === null) {
            return null;
        }
        const title =
            <h5>{this.props.formatMessage('search.results.title', {searchString: this.state.searchString})}</h5>;
        return <div className='container-fluid mt-4'>
            {title}
            <SearchResults results={this.state.results}/>
        </div>;
    }
}

export default connect(undefined, (dispatch: ThunkDispatch) => {
    return {
        search: (searchString: string) => dispatch(search(searchString))
    };
})(withRouter(injectIntl(withI18n(Search))));