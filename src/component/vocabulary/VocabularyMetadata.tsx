import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../hoc/withI18n";
import Vocabulary from "../../model/Vocabulary";
import {Button, ButtonToolbar, Col, Label, Row} from "reactstrap";
import OutgoingLink from "../misc/OutgoingLink";
import DocumentTab from "../document/DocumentTab";
import {GoPencil} from "react-icons/go";
import EditableComponent from "../misc/EditableComponent";
import EditVocabulary from "./EditVocabulary";
import {connect} from "react-redux";
import {ThunkDispatch} from "../../util/Types";
import {updateVocabulary} from "../../action/AsyncActions";

interface VocabularyMetadataProps extends HasI18n {
    vocabulary: Vocabulary;
    update: (vocabulary: Vocabulary) => Promise<any>;
}

export class VocabularyMetadata extends EditableComponent<VocabularyMetadataProps> {
    constructor(props: VocabularyMetadataProps) {
        super(props);
        this.state = {
            edit: false
        };
    }

    public onSave = (vocabulary: Vocabulary) => {
        this.props.update(vocabulary).then(() => this.onCloseEdit());
    };

    public render() {
        return this.state.edit ? <EditVocabulary vocabulary={this.props.vocabulary} save={this.onSave}
                                                 cancel={this.onCloseEdit}/> : this.renderMetadata();
    }

    private renderMetadata() {
        const i18n = this.props.i18n;
        const vocabulary = this.props.vocabulary;
        return <div className='metadata-panel'>
            <Row>
                <Col md={2}>
                    <Label className='attribute-label'>{i18n('vocabulary.metadata.identifier')}</Label>
                </Col>
                <Col md={10}>
                    <OutgoingLink iri={vocabulary.iri} label={vocabulary.iri}/>
                    <ButtonToolbar className='pull-right clearfix'>
                        <Button size='sm' color='info' title={i18n('edit')} onClick={this.onEdit}><GoPencil/></Button>
                    </ButtonToolbar>
                </Col>
            </Row>
            <Row>
                <Col md={2}>
                    <Label className='attribute-label'>{i18n('vocabulary.metadata.author')}</Label>
                </Col>
                <Col md={10}>
                    {vocabulary.author && vocabulary.author.fullName}
                </Col>
            </Row>
            <Row>
                <Col md={2}>
                    <Label className='attribute-label'>{i18n('vocabulary.metadata.created')}</Label>
                </Col>
                <Col md={10}>
                    {vocabulary.created && new Date(vocabulary.created).toLocaleString()}
                </Col>
            </Row>
            <DocumentTab vocabulary={vocabulary}/>
        </div>;
    }
}

export default connect(undefined, (dispatch: ThunkDispatch) => {
    return {
        update: (vocabulary: Vocabulary) => dispatch(updateVocabulary(vocabulary))
    };
})(injectIntl(withI18n(VocabularyMetadata)));