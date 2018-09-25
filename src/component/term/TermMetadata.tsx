import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Col, Label, Row} from "reactstrap";
import VocabularyTerm from "../../model/VocabularyTerm";
import OutgoingLink from "../misc/OutgoingLink";

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
                <OutgoingLink iri={term.iri} label={term.iri}/>
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
                <ul>
                    {term.subTerms && term.subTerms.map(st => <li key={st}><OutgoingLink iri={st} label={st}/></li>)}
                </ul>
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
                <ul>
                {(term.sources && term.sources.map) ? term.sources.map(st => <li key={st}>{st}</li>) : term.sources}
                </ul>
            </Col>
        </Row>
    </div>;
};

export default injectIntl(withI18n(VocabularyMetadata));