import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../hoc/withI18n";
import Vocabulary from "../../model/Vocabulary";
import {Col, Label, Row} from "reactstrap";
import OutgoingLink from "../misc/OutgoingLink";
import DocumentTab from "../document/DocumentTab";

interface VocabularyMetadataProps extends HasI18n {
    vocabulary: Vocabulary
}

const VocabularyMetadata: React.SFC<VocabularyMetadataProps> = (props: VocabularyMetadataProps) => {
    const i18n = props.i18n;
    const vocabulary = props.vocabulary;
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
        <DocumentTab vocabulary={vocabulary}/>
    </div>;
};

export default injectIntl(withI18n(VocabularyMetadata));