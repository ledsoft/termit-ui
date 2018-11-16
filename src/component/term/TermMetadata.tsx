import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Button, Col, Label, Row} from "reactstrap";
import Term from "../../model/Term";
import OutgoingLink from "../misc/OutgoingLink";
import "./TermMetadata.scss";
import Vocabulary from "../../model/Vocabulary";
import VocabularyUtils from "../../util/VocabularyUtils";
import Utils from "../../util/Utils";
import Routes from "../../util/Routes";
import Routing from '../../util/Routing';
import UnmappedProperties from "../genericmetadata/UnmappedProperties";
import AssetLabel from "../misc/AssetLabel";

interface TermMetadataProps extends HasI18n {
    vocabulary: Vocabulary;
    term: Term;
}

export class TermMetadata extends React.Component<TermMetadataProps> {

    constructor(props: TermMetadataProps) {
        super(props);
    }

    public openSubTerm = (term: Term) => {
        Routing.transitionTo(Routes.vocabularyTermDetail, {
            params: new Map([['name', VocabularyUtils.getFragment(this.props.vocabulary.iri)], ['termName', VocabularyUtils.getFragment(term.iri)]])
        });
    };

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
                    <Label>{term.label}</Label>
                </Col>
            </Row>
            <Row>
                <Col md={2}>
                    <Label className='attribute-label'>{i18n('term.metadata.comment')}</Label>
                </Col>
                <Col md={10}>
                    <Label>{term.comment}</Label>
                </Col>
            </Row>
            <Row>
                <Col md={2}>
                    <Label className='attribute-label'>{i18n('term.metadata.subTerms')}</Label>
                </Col>
                <Col md={10}>
                    {this.renderSubTerms()}
                </Col>
            </Row>
            <Row>
                <Col md={2}>
                    <Label className='attribute-label'>{i18n('term.metadata.types')}</Label>
                </Col>
                <Col md={10}>
                    {this.renderItems(term.types)}
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
            <UnmappedProperties properties={term.unmappedProperties}/>
        </div>;
    }

    private renderSubTerms() {
        const source = Utils.sanitizeArray(this.props.term.subTerms);
        if (source.length === 0) {
            return null;
        }
        return <ul className='term-items'>{source.map(item => <li key={item.iri}>
            <OutgoingLink iri={item.iri!}
                          label={<Button color='link' onClick={this.openSubTerm.bind(null, item)}
                                         title={this.props.i18n('term.metadata.subterm.link')}><AssetLabel
                              iri={item.iri!}/></Button>}/>
        </li>)}
        </ul>;
    }

    private renderItems(items: string[] | string | undefined) {
        if (!items) {
            return null;
        }
        const source = Utils.sanitizeArray(items);
        return <ul className='term-items'>{source.map((item: string) => <li key={item}>{Utils.isLink(item) ?
            <OutgoingLink iri={item} label={<AssetLabel iri={item}/>}/> : <Label>{item}</Label>}</li>)}</ul>;
    }
}

export default injectIntl(withI18n(TermMetadata));