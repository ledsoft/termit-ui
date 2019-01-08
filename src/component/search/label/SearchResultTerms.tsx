import * as React from 'react';
import {RouteComponentProps, withRouter} from "react-router";
import {Card, CardBody, CardHeader} from "reactstrap";
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../../hoc/withI18n";
import {connect} from "react-redux";
import * as SearchActions from "../../../action/SearchActions";
import {ThunkDispatch} from '../../../util/Types';
import Routes from "../../../util/Routes";
import TermItState from "../../../model/TermItState";
import SearchResult from "../../../model/SearchResult";
import {Link} from "react-router-dom";
import VocabularyUtils from "../../../util/VocabularyUtils";

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

    public render() {
        if (this.props.searchResults) {
            return <Card className='search-result-container'>
                <CardHeader tag='h4' color='info'>{this.props.i18n('search.pojem')}</CardHeader>
                <CardBody>
                    {this.props.searchResults!
                        .filter((r: SearchResult) => r.hasType(VocabularyUtils.TERM))
                        .map((r: SearchResult) => {
                            const to = Routes.vocabularyTermDetail.link({
                                name: VocabularyUtils.getFragment(r.vocabulary!),
                                termName: VocabularyUtils.getFragment(r.iri)
                            });
                            return <Link to={to} key={r.iri} className='search-result-item search-result-link'>{r.label}</Link>;
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
        searchResults: state.searchResults,
    };
}, (dispatch: ThunkDispatch) => {
    return {
        addSearchListener: () => dispatch(SearchActions.addSearchListener()),
        removeSearchListener: () => dispatch(SearchActions.removeSearchListener()),
    };
})(withRouter(injectIntl(withI18n(SearchResultTerms))));
