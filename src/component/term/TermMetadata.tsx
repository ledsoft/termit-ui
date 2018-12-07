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
import TermAssignments from "./TermAssignments";
import Tabs from "../misc/Tabs";

interface TermMetadataProps extends HasI18n {
    vocabulary: Vocabulary;
    term: Term;
}

interface TermMetadataState {
    activeTab: string;
}

export class TermMetadata extends React.Component<TermMetadataProps, TermMetadataState> {

    constructor(props: TermMetadataProps) {
        super(props);
        this.state = {
            activeTab: 'properties.edit.title'
        };
    }

    public openSubTerm = (term: Term) => {
        Routing.transitionTo(Routes.vocabularyTermDetail, {
            params: new Map([['name', VocabularyUtils.getFragment(this.props.vocabulary.iri)], ['termName', VocabularyUtils.getFragment(term.iri)]])
        });
    };

    private onTabSelect = (tabId: string) => {
        this.setState({activeTab: tabId});
    };

    public render() {
        const i18n = this.props.i18n;
        const term = this.props.term;
        return <div className='metadata-panel'>
            <Row>
                <Col xl={2} md={4}>
                    <Label className='attribute-label'>{i18n('term.metadata.identifier')}</Label>
                </Col>
                <Col xl={10} md={8}>
                    <OutgoingLink iri={term.iri} label={term.iri}/>
                </Col>
            </Row>
            <Row>
                <Col xl={2} md={4}>
                    <Label className='attribute-label'>{i18n('term.metadata.label')}</Label>
                </Col>
                <Col xl={10} md={8}>
                    <Label>{term.label}</Label>
                </Col>
            </Row>
            <Row>
                <Col xl={2} md={4}>
                    <Label className='attribute-label'>{i18n('term.metadata.comment')}</Label>
                </Col>
                <Col xl={10} md={8}>
                    <Label>{term.comment}</Label>
                </Col>
            </Row>
            <Row>
                <Col xl={2} md={4}>
                    <Label className='attribute-label'>{i18n('term.metadata.subTerms')}</Label>
                </Col>
                <Col xl={10} md={8}>
                    {this.renderSubTerms()}
                </Col>
            </Row>
            <Row>
                <Col xl={2} md={4}>
                    <Label className='attribute-label'>{i18n('term.metadata.types')}</Label>
                </Col>
                <Col xl={10} md={8}>
                    {this.renderItems(term.types)}
                </Col>
            </Row>
            <Row>
                <Col xl={2} md={4}>
                    <Label className='attribute-label'>{i18n('term.metadata.source')}</Label>
                </Col>
                <Col xl={10} md={8}>
                    {this.renderItems(term.sources)}
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <Tabs activeTabLabelKey={this.state.activeTab} changeTab={this.onTabSelect} tabs={{
                        'properties.edit.title': <UnmappedProperties properties={term.unmappedProperties} showInfoOnEmpty={true}/>,
                        'term.metadata.assignments.title': <TermAssignments term={term}/>
                    }}/>
                </Col>
            </Row>
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