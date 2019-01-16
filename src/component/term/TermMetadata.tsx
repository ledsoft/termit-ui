import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Button, Col, Label, Row} from "reactstrap";
import Term from "../../model/Term";
import OutgoingLink from "../misc/OutgoingLink";
import "./TermMetadata.scss";
import Vocabulary from "../../model/Vocabulary";
import VocabularyUtils from "../../util/VocabularyUtils";
import Utils from "../../util/Utils";
import Routes from "../../util/Routes";
import Routing from "../../util/Routing";
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
    assignmentsCount: number | null;
}

export class TermMetadata extends React.Component<TermMetadataProps, TermMetadataState> {

    constructor(props: TermMetadataProps) {
        super(props);
        this.state = {
            activeTab: "properties.edit.title",
            assignmentsCount: null,
        };
    }

    public openSubTerm = (term: Term) => {
        Routing.transitionTo(Routes.vocabularyTermDetail, {
            params: new Map([["name", VocabularyUtils.getFragment(this.props.vocabulary.iri)], ["termName", VocabularyUtils.getFragment(term.iri)]])
        });
    };

    private onTabSelect = (tabId: string) => {
        this.setState({activeTab: tabId});
    };

    private setAssignmentsCount = (assignmentsCount: number) => {
        this.setState({assignmentsCount});
    };

    public render() {
        const i18n = this.props.i18n;
        const term = this.props.term;
        return <div className="metadata-panel">
            <Row>
                <Col xl={2} md={4}>
                    <Label className="attribute-label">{i18n("term.metadata.types")}</Label>
                </Col>
                <Col xl={10} md={8}>
                    {this.renderTypes()}
                </Col>
            </Row>
            <Row>
                <Col xl={2} md={4}>
                    <Label className="attribute-label">{i18n("term.metadata.subTerms")}</Label>
                </Col>
                <Col xl={10} md={8}>
                    {this.renderSubTerms()}
                </Col>
            </Row>
            <Row>
                <Col xl={2} md={4}>
                    <Label className="attribute-label">{i18n("term.metadata.comment")}</Label>
                </Col>
                <Col xl={10} md={8}>
                    <Label>{term.comment}</Label>
                </Col>
            </Row>
            <Row>
                <Col xl={2} md={4}>
                    <Label className="attribute-label">{i18n("term.metadata.source")}</Label>
                </Col>
                <Col xl={10} md={8}>
                    {this.renderItems(term.sources)}
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <Tabs activeTabLabelKey={this.state.activeTab} changeTab={this.onTabSelect} tabs={{
                        'properties.edit.title': <UnmappedProperties properties={term.unmappedProperties} showInfoOnEmpty={true}/>,
                        'term.metadata.assignments.title': <TermAssignments term={term} onAssignmentsLoad={this.setAssignmentsCount}/>
                    }} tabBadges={{
                        'properties.edit.title': term.unmappedProperties.size.toFixed(),
                        'term.metadata.assignments.title': this.state.assignmentsCount !== null ? this.state.assignmentsCount.toFixed() : null
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
        return <ul className="term-items">{source.map(item => <li key={item.iri}>
            <OutgoingLink iri={item.iri!}
                          label={<Button color="link" onClick={this.openSubTerm.bind(null, item)}
                                         title={this.props.i18n("term.metadata.subterm.link")}><AssetLabel
                              iri={item.iri!}/></Button>}/>
        </li>)}
        </ul>;
    }

    private renderTypes() {
        // Ensures that the implicit TERM type is not rendered
        const types = this.props.term.types;
        return this.renderItems(types ? types.filter(t => t !== VocabularyUtils.TERM) : types);
    }

    private renderItems(items: string[] | string | undefined) {
        if (!items) {
            return null;
        }
        const source = Utils.sanitizeArray(items);
        return <ul className="term-items">{source.map((item: string) => <li key={item}>{Utils.isLink(item) ?
            <OutgoingLink iri={item} label={<AssetLabel iri={item}/>}/> : <Label>{item}</Label>}</li>)}</ul>;
    }
}

export default injectIntl(withI18n(TermMetadata));
