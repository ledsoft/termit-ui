import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../../hoc/withI18n";
import {RouteComponentProps, withRouter} from "react-router";
import {connect} from "react-redux";
import {Button, Card, CardBody, CardHeader, Col, Form, FormGroup, Input, Row} from "reactstrap";
import SearchResult from "../../../model/SearchResult";
import './Search.scss';
import {ThunkDispatch} from "redux-thunk";
import {Action} from "redux";
import {search} from "../../../action/AsyncActions";
import Vocabulary from "../../../util/Vocabulary";
import Routing from "../../../util/Routing";
import Routes from "../../../util/Routes";

interface SearchProps extends HasI18n, RouteComponentProps<any> {
    search: (searchString: string) => Promise<object>;
}

interface SearchState {
    searchString: string;
    results: SearchResult[] | null;
}

class Search extends React.Component<SearchProps, SearchState> {

    constructor(props: SearchProps) {
        super(props);
        this.state = {
            searchString: '',
            results: null
        };
    }

    public componentDidMount() {
        const query = this.props.location.search;
        const match = query.match(/searchString=(.+)/);
        if (match) {
            const searchString = match[1];
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

    private openResult = (result: SearchResult) => {
        this.clear();
        if (result.types.indexOf(Vocabulary.VOCABULARY) !== -1) {
            Routing.transitionTo(Routes.vocabularyDetail, {params: new Map([['name', Vocabulary.getFragment(result.iri)]])});
        } else {
            // TODO Transition to term (once term detail is implemented)
            alert('Not implemented, yet!');
        }
    };

    private clear = () => {
        this.setState({searchString: '', results: null});
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
        let content;
        if (this.state.results.length === 0) {
            content = <Row><Col md={6}>
                <div className='italics'>{this.props.i18n('main.search.no-results')}</div>
            </Col></Row>;
        } else {
            content = <div>
                <Row><Col md={12}>{this.renderVocabularies()}</Col></Row>
                <Row><Col md={12}>{this.renderTerms()}</Col></Row>
            </div>;
        }
        return <div className='container-fluid'>
            <hr/>
            {title}
            {content}
        </div>;
    }

    private renderVocabularies() {
        return <Card className='search-result-container'>
            <CardHeader tag='h5' color='info'>{this.props.i18n('search.slovnik')}</CardHeader>
            <CardBody>
                {this.state.results!.filter(r => r.hasType(Vocabulary.VOCABULARY)).map(r => {
                    return <span key={r.iri} className='search-result-item search-result-link btn-link'
                                 title={this.props.i18n('search.results.item.vocabulary.tooltip')}
                                 onClick={this.openResult.bind(null, r)}>{r.label}</span>;
                })}
            </CardBody>
        </Card>;
    }

    private renderTerms() {
        return <Card className='search-result-container'>
            <CardHeader tag='h5' color='info'>{this.props.i18n('search.pojem')}</CardHeader>
            <CardBody>
                {this.state.results!.filter(r => r.hasType(Vocabulary.TERM)).map(r => {
                    return <span key={r.iri} className='search-result-item search-result-link btn-link'
                                 title={this.props.i18n('search.results.item.term.tooltip')}
                                 onClick={this.openResult.bind(null, r)}>{r.label}</span>;
                })}
            </CardBody>
        </Card>;
    }
}

export default connect(undefined, (dispatch: ThunkDispatch<object, undefined, Action>) => {
    return {
        search: (searchString: string) => dispatch(search(searchString))
    };
})(withRouter(injectIntl(withI18n(Search))));