import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import Resource, {EMPTY_RESOURCE} from "../../model/Resource";
import TermAssignment from "../../model/TermAssignment";
import {connect} from "react-redux";
import {ThunkDispatch} from "../../util/Types";
import {loadResourceTermAssignments} from "../../action/AsyncActions";
import VocabularyUtils from "../../util/VocabularyUtils";
import IntlData from "../../model/IntlData";
import Term from "../../model/Term";
import TermOccurrence from "../../model/TermOccurrence";
import {Badge, Col, Label, Row} from "reactstrap";
import TermLink from "../term/TermLink";

interface ResourceTermAssignmentsOwnProps {
    resource: Resource;
}

interface ResourceTermAssignmentsDispatchProps {
    loadTermAssignments: (resource: Resource) => Promise<TermAssignment[]>;
}

interface ResourceTermAssignmentsState {
    assignments: TermAssignment[];
}

type ResourceTermAssignmentsProps = ResourceTermAssignmentsOwnProps & ResourceTermAssignmentsDispatchProps & HasI18n;

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
        const assignmentMap = this.mapAssignments();
        return <>
            <Row>
                <Col md={2}>
                    <Label className="attribute-label" title={i18n("resource.metadata.terms.assigned.tooltip")}>
                        {i18n("resource.metadata.terms.assigned")}
                    </Label>
                </Col>
                <Col md={10} className="resource-terms">
                    {this.renderAssignedTerms(assignmentMap)}
                </Col>
            </Row>
            <Row>
                <Col md={2}>
                    <Label className="attribute-label" title={i18n("resource.metadata.terms.occurrences.tooltip")}>
                        {i18n("resource.metadata.terms.occurrences")}
                    </Label>
                </Col>
                <Col md={10} className="resource-terms">
                    {this.renderTermOccurrences(assignmentMap)}
                </Col>
            </Row>
        </>;
    }

    private mapAssignments() {
        const map = new Map<string, { term: Term, assignment: boolean, occurrenceCount: number, suggestedOccurrenceCount: number }>();
        this.state.assignments.forEach(ta => {
            const termIri = ta.term.iri;
            let item;
            if (map.has(termIri)) {
                item = map.get(termIri)!;
            } else {
                item = {
                    term: ta.term,
                    assignment: false,
                    occurrenceCount: 0,
                    suggestedOccurrenceCount: 0
                };
            }
            if (ta instanceof TermOccurrence) {
                if (ta.isSuggested()) {
                    item.suggestedOccurrenceCount += 1;
                } else {
                    item.occurrenceCount += 1;
                }
            } else {
                item.assignment = true;
            }
            map.set(termIri, item);
        });
        return map;
    }

    private renderAssignedTerms(assignmentMap: Map<string, { term: Term, assignment: boolean }>) {
        const items: JSX.Element[] = [];
        assignmentMap.forEach((v, k) => {
            if (v.assignment) {
                items.push(<span key={k} className="resource-term-link m-term-assignment">
                            <TermLink term={v.term}/>
                        </span>);
            }
        });
        return items;
    }

    private renderTermOccurrences(assignmentMap: Map<string, { term: Term, occurrenceCount: number, suggestedOccurrenceCount: number }>) {
        const items: JSX.Element[] = [];
        assignmentMap.forEach((v, k) => {
            if (v.occurrenceCount === 0 && v.suggestedOccurrenceCount === 0) {
                return;
            }
            items.push(<span key={k} className="resource-term-link m-term-occurrence">
                            <TermLink term={v.term}/>
                {v.occurrenceCount > 0 &&
                <Badge title={this.props.i18n("resource.metadata.terms.occurrences.confirmed.tooltip")} className="m-term-occurrence-confirmed"
                       color="secondary">{this.props.formatMessage("resource.metadata.terms.occurrences.confirmed", {count: v.occurrenceCount})}</Badge>}
                {v.suggestedOccurrenceCount > 0 &&
                <Badge title={this.props.i18n("resource.metadata.terms.occurrences.suggested.tooltip")} className="m-term-occurrence-suggested"
                       color="secondary">{this.props.formatMessage("resource.metadata.terms.occurrences.suggested", {count: v.suggestedOccurrenceCount})}</Badge>}
                        </span>);
        });
        return items;
    }
}

export default connect<{ intl: IntlData }, ResourceTermAssignmentsDispatchProps, ResourceTermAssignmentsOwnProps>(undefined, (dispatch: ThunkDispatch) => {
    return {
        loadTermAssignments: (resource: Resource) => dispatch(loadResourceTermAssignments(VocabularyUtils.create(resource.iri)))
    };
})(injectIntl(withI18n(ResourceTermAssignments)));