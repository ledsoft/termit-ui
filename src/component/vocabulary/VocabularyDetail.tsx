import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Col, Row} from 'reactstrap';
import {Route, RouteComponentProps, Switch} from "react-router";
import GlossaryTerms from "../term/GlossaryTerms";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {loadVocabulary} from "../../action/ComplexActions";
import Vocabulary from "../../model/Vocabulary";
import './VocabularyDetail.scss';
import OutgoingLink from "../misc/OutgoingLink";
import VocabularyDetailTabPanel from "./VocabularyDetailTabPanel";
import Routes from "../../util/Routes";
import CreateVocabularyTerm from "../term/CreateVocabularyTerm";
import {IRI} from "../../util/VocabularyUtils";
import DocumentTab from "../document/DocumentTab";
import {ThunkDispatch} from '../../util/Types';

interface VocabularyDetailProps extends HasI18n, RouteComponentProps<any> {
    vocabulary: Vocabulary,
    loadVocabulary: (iri: IRI) => void
}

export class VocabularyDetail extends React.Component<VocabularyDetailProps> {

    public componentDidMount(): void {
        const normalizedName: string = this.props.match.params.name;
        this.props.loadVocabulary({fragment: normalizedName});
    }

    public render() {
        const name = this.props.vocabulary.name;
        const author = this.props.vocabulary.author && this.props.vocabulary.author.fullName;
        const created = new Date(this.props.vocabulary.created as number).toLocaleString();
        const vocabularyDetailTabPanel = () => <VocabularyDetailTabPanel
            vocabulary={this.props.vocabulary}
        />;
        // @ts-ignore
        const createVocabularyTerm = () => <CreateVocabularyTerm/>;

        return <div>
            <h2 className='page-header'>
                <OutgoingLink
                    label={name}
                    iri={this.props.vocabulary.iri as string}
                />
            </h2>
            <h6>{this.props.formatMessage('vocabulary.detail.subtitle', {author, created})}</h6>
            <Row className='detail-row'>
                <Col md={4}>
                    <GlossaryTerms/>
                </Col>
                <Col md={8}>
                    <Switch>
                        <Route path={Routes.vocabularyDetail.path} component={vocabularyDetailTabPanel}/>
                        <Route path={Routes.vocabularyTermDetail.path} component={vocabularyDetailTabPanel}/>
                        <Route path={Routes.createVocabularyTerm.path} component={createVocabularyTerm}/>
                    </Switch>
                    <DocumentTab/>
                </Col>
            </Row>
        </div>;
    }
}

export default connect((state: TermItState) => {
    return {
        vocabulary: state.vocabulary
    };
}, (dispatch: ThunkDispatch) => {
    return {
        loadVocabulary: (iri: IRI) => dispatch(loadVocabulary(iri)),
    };
})(injectIntl(withI18n(VocabularyDetail)));