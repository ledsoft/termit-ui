import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Col, Label, Row} from "reactstrap";
import Term from "../../model/Term";
import OutgoingLink from "../misc/OutgoingLink";
import "./TermMetadata.scss";
import VocabularyUtils, {IRI} from "../../util/VocabularyUtils";
import Utils from "../../util/Utils";
import UnmappedProperties from "../genericmetadata/UnmappedProperties";
import AssetLabel from "../misc/AssetLabel";
import TermAssignments from "./TermAssignments";
import Tabs from "../misc/Tabs";
import TermLink from "./TermLink";
import {connect} from "react-redux";
import {ThunkDispatch} from "../../util/Types";
import {loadTerms} from "../../action/AsyncActions";

interface TermMetadataProps extends HasI18n {
    term: Term;
    loadSubTerms: (term: Term, vocabularyIri: IRI) => Promise<Term[]>;
}

interface TermMetadataState {
    activeTab: string;
    assignmentsCount: number | null;
    subTerms: Term[];
}

export class TermMetadata extends React.Component<TermMetadataProps, TermMetadataState> {

    constructor(props: TermMetadataProps) {
        super(props);
        this.state = {
            activeTab: "properties.edit.title",
            assignmentsCount: null,
            subTerms: []
        };
    }

    public componentDidMount(): void {
        this.loadSubTerms();
    }

    public componentDidUpdate(prevProps: Readonly<TermMetadataProps>): void {
        if (prevProps.term.iri !== this.props.term.iri) {
            this.loadSubTerms();
        }
    }

    private loadSubTerms() {
        const term = this.props.term;
        if (!term.vocabulary) {
            return;
        }
        const vocabularyIri = VocabularyUtils.create(term.vocabulary!.iri!);
        this.props.loadSubTerms(term, vocabularyIri).then((data: Term[]) => this.setState({subTerms: data}));
    }

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
                    <Label className="attribute-label">{i18n("term.metadata.definition")}</Label>
                </Col>
                <Col xl={10} md={8}>
                    <Label id="term-metadata-definition">{term.definition}</Label>
                </Col>
            </Row>
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
                    <Label id="term-metadata-comment">{term.comment}</Label>
                </Col>
            </Row>
            <Row>
                <Col xl={2} md={4}>
                    <Label className="attribute-label">{i18n("term.metadata.source")}</Label>
                </Col>
                <Col xl={10} md={8}>
                    {this.renderItems(term.sources, "term-metadata-sources")}
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <Tabs activeTabLabelKey={this.state.activeTab} changeTab={this.onTabSelect} tabs={{
                        "properties.edit.title": <UnmappedProperties properties={term.unmappedProperties}
                                                                     showInfoOnEmpty={true}/>,
                        "term.metadata.assignments.title": <TermAssignments term={term}
                                                                            onAssignmentsLoad={this.setAssignmentsCount}/>
                    }} tabBadges={{
                        "properties.edit.title": term.unmappedProperties.size.toFixed(),
                        "term.metadata.assignments.title": this.state.assignmentsCount !== null ? this.state.assignmentsCount.toFixed() : null
                    }}/>
                </Col>
            </Row>
        </div>;
    }

    private renderSubTerms() {
        const source = Utils.sanitizeArray(this.state.subTerms);
        if (source.length === 0) {
            return null;
        }
        return <ul id="term-metadata-subterms" className="term-items">{source.map(item => <li key={item.iri}>
            <TermLink term={item}/>
        </li>)}
        </ul>;
    }

    private renderTypes() {
        // Ensures that the implicit TERM type is not rendered
        const types = this.props.term.types;
        return this.renderItems(types ? types.filter(t => t !== VocabularyUtils.TERM) : types, "term-metadata-types");
    }

    private renderItems(items: string[] | string | undefined, containerId?: string) {
        if (!items) {
            return null;
        }
        const source = Utils.sanitizeArray(items);
        return <ul id={containerId} className="term-items">
            {source.map((item: string) => <li key={item}>{Utils.isLink(item) ?
                <OutgoingLink iri={item} label={<AssetLabel iri={item}/>}/> : <Label>{item}</Label>}</li>)}
        </ul>;
    }
}

export default connect(undefined, (dispatch: ThunkDispatch) => {
    return {
        loadSubTerms: (term: Term, vocabularyIri: IRI) => dispatch(loadTerms({optionID: term.iri}, vocabularyIri))
    };
})(injectIntl(withI18n(TermMetadata)));
