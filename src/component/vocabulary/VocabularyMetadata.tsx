import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../hoc/withI18n";
import Vocabulary from "../../model/Vocabulary";
import {Col, Label, Row} from "reactstrap";
import OutgoingLink from "../misc/OutgoingLink";
import VocabularyDocument from '../document/VocabularyDocument';
import UnmappedProperties from "../genericmetadata/UnmappedProperties";

interface VocabularyMetadataProps extends HasI18n {
    vocabulary: Vocabulary
}

class VocabularyMetadata extends React.Component<VocabularyMetadataProps> {
    constructor(props: VocabularyMetadataProps) {
        super(props);
    }

    public render() {
        const i18n = this.props.i18n;
        const vocabulary = this.props.vocabulary;
        return <div className='metadata-panel'>
            <Row>
                <Col md={2}>
                    <Label className='attribute-label'>{i18n('vocabulary.metadata.identifier')}</Label>
                </Col>
                <Col md={10}>
                    <OutgoingLink iri={vocabulary.iri} label={vocabulary.iri}/>
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
            <Row>
                <Col xs={12}>
                    <UnmappedProperties properties={vocabulary.unmappedProperties}/>
                </Col>
            </Row>
            <VocabularyDocument vocabulary={vocabulary}/>
        </div>;
    }
}

export default injectIntl(withI18n(VocabularyMetadata));