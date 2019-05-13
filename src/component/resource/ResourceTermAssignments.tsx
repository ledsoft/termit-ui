import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import Resource, {EMPTY_RESOURCE} from "../../model/Resource";
import {connect} from "react-redux";
import {ThunkDispatch} from "../../util/Types";
import {loadResourceTermAssignmentsInfo} from "../../action/AsyncActions";
import VocabularyUtils from "../../util/VocabularyUtils";
import IntlData from "../../model/IntlData";
import Term from "../../model/Term";
import {Badge, Col, Label, Row} from "reactstrap";
import TermLink from "../term/TermLink";
import {
    ResourceTermAssignments as TermAssignmentInfo,
    ResourceTermOccurrences
} from "../../model/ResourceTermAssignments";

interface ResourceTermAssignmentsOwnProps {
    resource: Resource;
}

interface ResourceTermAssignmentsDispatchProps {
    loadTermAssignments: (resource: Resource) => Promise<TermAssignmentInfo[]>;
}

interface ResourceTermAssignmentsState {
    assignments: TermAssignmentInfo[];
}

type ResourceTermAssignmentsProps = ResourceTermAssignmentsOwnProps & ResourceTermAssignmentsDispatchProps & HasI18n;

function isOccurrence(item: TermAssignmentInfo) {
    return item.types.indexOf(VocabularyUtils.TERM_OCCURRENCE) !== -1;
}

export class ResourceTermAssignments extends React.Component<ResourceTermAssignmentsProps, ResourceTermAssignmentsState> {
    constructor(props: ResourceTermAssignmentsProps) {
        super(props);
        this.state = {assignments: []};
    }

    public componentDidMount(): void {
        if (this.props.resource !== EMPTY_RESOURCE) {
            this.loadAssignments();
        }
    }

    public componentDidUpdate(prevProps: Readonly<ResourceTermAssignmentsProps>): void {
        if (prevProps.resource.iri !== this.props.resource.iri && this.props.resource !== EMPTY_RESOURCE) {
            this.loadAssignments();
        }
    }

    private loadAssignments() {
        this.props.loadTermAssignments(this.props.resource).then(data => this.setState({assignments: data}));
    }

    public render() {
        const i18n = this.props.i18n;
        return <>
            <Row>
                <Col md={2}>
                    <Label className="attribute-label" title={i18n("resource.metadata.terms.assigned.tooltip")}>
                        {i18n("resource.metadata.terms.assigned")}
                    </Label>
                </Col>
                <Col md={10} className="resource-terms">
                    {this.renderAssignedTerms()}
                </Col>
            </Row>
            <Row>
                <Col md={2}>
                    <Label className="attribute-label" title={i18n("resource.metadata.terms.occurrences.tooltip")}>
                        {i18n("resource.metadata.terms.occurrences")}
                    </Label>
                </Col>
                <Col md={10} className="resource-terms">
                    {this.renderTermOccurrences()}
                </Col>
            </Row>
        </>;
    }

    private renderAssignedTerms() {
        const items: JSX.Element[] = [];
        this.state.assignments.filter(rta => !isOccurrence(rta)).forEach((rta) => {
                            items.push(<span key={rta.term.iri} className="resource-term-link m-term-assignment">
                            <TermLink term={new Term({iri: rta.term.iri, label: rta.label, vocabulary: rta.vocabulary})}/>
                        </span>);
        });
        return items;
    }

    private renderTermOccurrences() {
        const items: JSX.Element[] = [];
        const occurrences = new Map<string, {term: Term, suggestedCount: number, assertedCount: number}>();
        this.state.assignments.filter(isOccurrence).forEach(rta => {
            if (!occurrences.has(rta.term.iri!)) {
                occurrences.set(rta.term.iri!, {
                    term: new Term({iri: rta.term.iri, label: rta.label, vocabulary: rta.vocabulary}),
                    suggestedCount: 0,
                    assertedCount: 0
                });
            }
            if (rta.types.indexOf(VocabularyUtils.SUGGESTED_TERM_OCCURRENCE) !== -1) {
                occurrences.get(rta.term.iri!)!.suggestedCount = (rta as ResourceTermOccurrences).count;
            } else {
                occurrences.get(rta.term.iri!)!.assertedCount = (rta as ResourceTermOccurrences).count;
            }
        });
        occurrences.forEach((v, k) => {
            items.push(<span key={k} className="resource-term-link m-term-occurrence">
                            <TermLink term={v.term}/>
                {v.assertedCount > 0 &&
                <Badge title={this.props.i18n("resource.metadata.terms.occurrences.confirmed.tooltip")} className="m-term-occurrence-confirmed"
                       color="secondary">{this.props.formatMessage("resource.metadata.terms.occurrences.confirmed", {count: v.assertedCount})}</Badge>}
                {v.suggestedCount > 0 &&
                <Badge title={this.props.i18n("resource.metadata.terms.occurrences.suggested.tooltip")} className="m-term-occurrence-suggested"
                       color="secondary">{this.props.formatMessage("resource.metadata.terms.occurrences.suggested", {count: v.suggestedCount})}</Badge>}
                        </span>);
        });
        return items;
    }
}

export default connect<{ intl: IntlData }, ResourceTermAssignmentsDispatchProps, ResourceTermAssignmentsOwnProps>(undefined, (dispatch: ThunkDispatch) => {
    return {
        loadTermAssignments: (resource: Resource) => dispatch(loadResourceTermAssignmentsInfo(VocabularyUtils.create(resource.iri)))
    };
})(injectIntl(withI18n(ResourceTermAssignments)));