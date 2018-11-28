import * as React from 'react';
import {RouteComponentProps, withRouter} from "react-router";
import {Card, CardBody, CardHeader} from "reactstrap";
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../../hoc/withI18n";
import {connect} from "react-redux";
import Vocabulary from "../../../util/VocabularyUtils";
import * as SearchActions from "../../../action/SearchActions";
import {ThunkDispatch} from '../../../util/Types';
import Routing from "../../../util/Routing";
import Routes from "../../../util/Routes";
import TermItState from "../../../model/TermItState";
import SearchResult from "../../../model/SearchResult";

interface SearchResultTermsProps extends HasI18n, RouteComponentProps<any> {
    addSearchListener: () => void;
    removeSearchListener: () => void;
    searchResults: SearchResult[] | null;
}

export class SearchResultTerms extends React.Component<SearchResultTermsProps> {

    public componentDidMount() {
        this.props.addSearchListener();
    }

    public componentWillUnmount() {
        this.props.removeSearchListener();
    }

    private openResult = (result: SearchResult) => {
        if (result.types.indexOf(Vocabulary.VOCABULARY) !== -1) {
            Routing.transitionTo(Routes.vocabularyDetail, {params: new Map([['name', Vocabulary.getFragment(result.iri)]])});
        } else {
            // TODO Transition to term (once term detail is implemented)
            Routing.transitionTo(Routes.vocabularyDetail, {params: new Map([['name', Vocabulary.getFragment(result.vocabularyIri!)]])});
        }
    };

    public render() {
        const i18n = this.props.i18n;
        if (this.props.searchResults) {
            return <Card className='search-result-container'>
                <CardHeader tag='h5' color='info'>{i18n('search.pojem')}</CardHeader>
                <CardBody>
                    {this.props.searchResults!
                        .filter((r: SearchResult) => r.hasType(Vocabulary.TERM))
                        .map((r: SearchResult) => {
                            return <span key={r.iri} className='search-result-item search-result-link btn-link'
                                         title={this.props.i18n('search.results.item.term.tooltip')}
                                         onClick={this.openResult.bind(null, r)}>{r.label}</span>;
                        })
                    }
                </CardBody>
            </Card>;
        } else {
            return null;
        }
    }

}

export default connect((state: TermItState) => {
    return {
        searchResults: state.searchResults,   // FIXME
    };
}, (dispatch: ThunkDispatch) => {
    return {
        addSearchListener: () => dispatch(SearchActions.addSearchListener()),
        removeSearchListener: () => dispatch(SearchActions.removeSearchListener()),
    };
})(withRouter(injectIntl(withI18n(SearchResultTerms))));
