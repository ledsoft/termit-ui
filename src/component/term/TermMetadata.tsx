import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Col, Label, Row} from "reactstrap";
import Term from "../../model/Term";
import OutgoingLink from "../misc/OutgoingLink";
import "./TermMetadata.scss";

interface VocabularyMetadataProps extends HasI18n {
    term: Term,
}

class VocabularyMetadata extends React.Component<VocabularyMetadataProps> {
    public render() {
        const i18n = this.props.i18n;
        const term = this.props.term;
        return <div className='metadata-panel'>
            <Row>
                <Col md={2}>
                    <Label className='attribute-label'>{i18n('term.metadata.identifier')}</Label>
                </Col>
                <Col md={10}>
                    <OutgoingLink iri={term.iri} label={term.iri}/>
                </Col>
            </Row>
            <Row>
                <Col md={2}>
                    <Label className='attribute-label'>{i18n('term.metadata.label')}</Label>
                </Col>
                <Col md={10}>
                    {term.label}
                </Col>
            </Row>
            <Row>
                <Col md={2}>
                    <Label className='attribute-label'>{i18n('term.metadata.comment')}</Label>
                </Col>
                <Col md={10}>
                    {term.comment}
                </Col>
            </Row>
            <Row>
                <Col md={2}>
                    <Label className='attribute-label'>{i18n('term.metadata.subTerms')}</Label>
                </Col>
                <Col md={10}>
                    {this.renderItems(term.subTerms, true)}
                </Col>
            </Row>
            <Row>
                <Col md={2}>
                    <Label className='attribute-label'>{i18n('term.metadata.types')}</Label>
                </Col>
                <Col md={10}>
                    {this.renderItems(term.types, true)}
                </Col>
            </Row>
            <Row>
                <Col md={2}>
                    <Label className='attribute-label'>{i18n('term.metadata.source')}</Label>
                </Col>
                <Col md={10}>
                    {this.renderItems(term.sources)}
                </Col>
            </Row>
        </div>;
    }

    private renderItems(items: string[] | string | undefined, withLink: boolean = false) {
        if (!items) {
            return null;
        }
        const source = Array.isArray(items) ? items : [items];
        return <ul className='term-items'>{source.map((item: string) => <li key={item}>{withLink ?
            <OutgoingLink iri={item} label={item}/> : item}</li>)}</ul>;
    }
}

export default injectIntl(withI18n(VocabularyMetadata));