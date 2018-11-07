import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../../hoc/withI18n";
import {RouteComponentProps, withRouter} from "react-router";
import {connect} from "react-redux";
import {Card, CardBody, CardHeader, Col, Row} from "reactstrap";
import SearchResult from "../../../model/SearchResult";
import './Search.scss';
import {search} from "../../../action/AsyncActions";
import Vocabulary from "../../../util/VocabularyUtils";
import Routing from "../../../util/Routing";
import Routes from "../../../util/Routes";
import {ThunkDispatch} from '../../../util/Types';
import TermItState from "../../../model/TermItState";

interface SearchProps extends HasI18n, RouteComponentProps<any> {
    search: (searchString: string) => Promise<object>;
    searchString: string;
}

interface SearchState {
    results: SearchResult[] | null;
}

export class Search extends React.Component<SearchProps, SearchState> {

    constructor(props: SearchProps) {
        super(props);
        this.state = {
            results: null
        };
    }

    public componentDidUpdate(prevProps: SearchProps, prevState: SearchState) {
        if (this.props.searchString !== prevProps.searchString) {
            window.console.log('Search:', prevProps.searchString, ' -> ', this.props.searchString);
            this.search(this.props.searchString);
        }
    }

    public componentDidMount() {
        this.search(this.props.searchString);
    }

    /*
    // TODO: Parse URL on page load (or some time like that)
    public componentDidMount() {
        const query = this.props.location.search;
        const match = query.match(/searchString=(.+)/);
        if (match) {
            const searchString = match[1];
            this.search(searchString);
        }
    }
    */

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
            Routing.transitionTo(Routes.vocabularyDetail, {params: new Map([['name', Vocabulary.getFragment(result.vocabularyIri!)]])});
        }
    };

    private clear = () => {
        this.setState({results: null});
    };

    public render() {
        const i18n = this.props.i18n;
        return <div>
            <h2 className='page-header'>{i18n('search.title')}</h2>
            <Row>
                {this.renderResults()}
            </Row>
        </div>;
    }

    private renderResults() {
        if (this.state.results === null) {
            return null;
        }
        const title = this.props.formatMessage('search.results.title', {searchString: this.props.searchString});
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
            <h3>{title}</h3>
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

export default connect((state: TermItState) => {
    return {
        searchString: state.searchQuery,
    };
}, (dispatch: ThunkDispatch) => {
    return {
        search: (searchString: string) => dispatch(search(searchString))
    };
})(withRouter(injectIntl(withI18n(Search))));
