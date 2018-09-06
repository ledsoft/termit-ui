import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Col, Row} from 'reactstrap';
import {RouteComponentProps} from "react-router";
import GlossaryTerms from "../term/GlossaryTerms";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {ThunkDispatch} from "redux-thunk";
import {Action} from "redux";
import {loadVocabulary} from "../../action/ComplexActions";
import Vocabulary from "../../model/Vocabulary";
import './VocabularyDetail.scss';
import OutgoingLink from "../misc/OutgoingLink";
import VocabularyDetailTabPanel from "./VocabularyDetailTabPanel";

interface VocabularyDetailProps extends HasI18n {
    vocabulary: Vocabulary,
    loadVocabulary: (normalizedName: string) => void
}

export class VocabularyDetail extends React.Component<VocabularyDetailProps & RouteComponentProps<any>> {

    public componentDidMount(): void {
        const normalizedName = this.props.match.params.name;
        this.props.loadVocabulary(normalizedName);
    }

    public render() {
        const name = this.props.vocabulary.name;
        const author = this.props.vocabulary.author && this.props.vocabulary.author.fullName;
        const created = new Date(this.props.vocabulary.created as number).toLocaleString();
        return <div>
            <h2 className='page-header'>
                <OutgoingLink
                    label={this.props.formatMessage('vocabulary.detail.title', {name})}
                    iri={this.props.vocabulary.iri as string}
                />
            </h2>
            <h6>{this.props.formatMessage('vocabulary.detail.subtitle', { author, created })}</h6>
            <Row className='detail-row'>
                <Col md={4}>
                    <GlossaryTerms/>
                </Col>
                <Col md={8}>
                    <VocabularyDetailTabPanel
                        vocabulary={this.props.vocabulary}
                    />
                </Col>
            </Row>
        </div>;
    }
}

export default connect((state: TermItState) => {
    return {
        vocabulary: state.vocabulary
    };
}, (dispatch: ThunkDispatch<object, undefined, Action>) => {
    return {
        loadVocabulary: (normalizedName: string) => dispatch(loadVocabulary(normalizedName))
    };
})(injectIntl(withI18n(VocabularyDetail)));