import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Col, Label, Row} from "reactstrap";
import VocabularyTerm from "../../model/VocabularyTerm";

interface VocabularyMetadataProps extends HasI18n {
    term: VocabularyTerm,
}

const VocabularyMetadata: React.SFC<VocabularyMetadataProps> = (props: VocabularyMetadataProps) => {
    const i18n = props.i18n;
    const term = props.term;
    return <div className='metadata-panel'>
        <Row>
            <Col md={2}>
                <Label>{i18n('term.metadata.identifier')}</Label>
            </Col>
            <Col md={10}>
                <a href={term.iri} target='_blank'>{term.iri}</a>
            </Col>
        </Row>
        <Row>
            <Col md={2}>
                <Label>{i18n('term.metadata.label')}</Label>
            </Col>
            <Col md={10}>
                {term.label}
            </Col>
        </Row>
        <Row>
            <Col md={2}>
                <Label>{i18n('term.metadata.comment')}</Label>
            </Col>
            <Col md={10}>
                {term.comment}
            </Col>
        </Row>
        <Row>
            <Col md={2}>
                <Label>{i18n('term.metadata.subTerms')}</Label>
            </Col>
            <Col md={10}>
                {term.subTerms && term.subTerms.toString()}
            </Col>
        </Row>
        <Row>
            <Col md={2}>
                <Label>{i18n('term.metadata.types')}</Label>
            </Col>
            <Col md={10}>
                {term.types && term.types.toString()}
            </Col>
        </Row>
        <Row>
            <Col md={2}>
                <Label>{i18n('term.metadata.source')}</Label>
            </Col>
            <Col md={10}>
                {term.source}
            </Col>
        </Row>
    </div>;
};

export default injectIntl(withI18n(VocabularyMetadata));