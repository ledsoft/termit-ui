import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Col, Row} from 'reactstrap';
import {Route, RouteComponentProps, Switch} from "react-router";
import Terms from "../term/Terms";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {loadTypes, loadVocabulary} from "../../action/AsyncActions";
import Vocabulary from "../../model/Vocabulary";
import './VocabularyDetail.scss';
import OutgoingLink from "../misc/OutgoingLink";
import VocabularyDetailTabPanel from "./VocabularyDetailTabPanel";
import Routes from "../../util/Routes";
import {IRI} from "../../util/VocabularyUtils";
import {ThunkDispatch} from '../../util/Types';
import CreateTerm from "../term/CreateTerm";

interface VocabularyDetailProps extends HasI18n, RouteComponentProps<any> {
    vocabulary: Vocabulary,
    loadVocabulary: (iri: IRI) => void,
    loadTypes: (language: string) => void,
    lang : string
}

export class VocabularyDetail extends React.Component<VocabularyDetailProps> {

    public componentDidMount(): void {
        const normalizedName: string = this.props.match.params.name;
        this.props.loadVocabulary({fragment: normalizedName});
        this.props.loadTypes(this.props.lang);
    }

    public render() {
        const label = this.props.vocabulary.label;
        const author = this.props.vocabulary.author && this.props.vocabulary.author.fullName;
        const created = new Date(this.props.vocabulary.created as number).toLocaleString();

        return <div>
            <h2 className='page-header'>
                <OutgoingLink
                    label={label}
                    iri={this.props.vocabulary.iri as string}
                />
            </h2>
            <h6>{this.props.formatMessage('vocabulary.detail.subtitle', {author, created})}</h6>
            <Row className='detail-row'>
                <Col md={4}>
                    <Terms/>
                </Col>
                <Col md={8}>
                    <Switch>
                        <Route path={Routes.vocabularyDetail.path} component={VocabularyDetailTabPanel}/>
                        <Route path={Routes.vocabularyTermDetail.path} component={VocabularyDetailTabPanel}/>
                        <Route path={Routes.createVocabularyTerm.path} component={CreateTerm}/>
                    </Switch>
                </Col>
            </Row>
        </div>;
    }
}

export default connect((state: TermItState) => {
    return {
        vocabulary: state.vocabulary,
        lang: state.intl.locale,
    };
}, (dispatch: ThunkDispatch) => {
    return {
        loadVocabulary: (iri: IRI) => dispatch(loadVocabulary(iri)),
        loadTypes: (lang: string) => dispatch(loadTypes(lang)),
    };
})(injectIntl(withI18n(VocabularyDetail)));