import * as React from "react";
import {injectIntl} from "react-intl";
import classNames from "classnames";
import withI18n, {HasI18n} from "../hoc/withI18n";
import Resource, {EMPTY_RESOURCE} from "../../model/Resource";
import {connect} from "react-redux";
import {ThunkDispatch} from "../../util/Types";
import {loadResourceTermAssignmentsInfo} from "../../action/AsyncActions";
import VocabularyUtils from "../../util/VocabularyUtils";
import Term from "../../model/Term";
import {Badge, Col, Label, Row} from "reactstrap";
import TermLink from "../term/TermLink";
import {
    ResourceTermAssignments as TermAssignmentInfo,
    ResourceTermOccurrences
} from "../../model/ResourceTermAssignments";
import Utils from "../../util/Utils";
import AppNotification from "../../model/AppNotification";
import TermItState from "../../model/TermItState";
import NotificationType from "../../model/NotificationType";
import {consumeNotification} from "../../action/SyncActions";

interface ResourceTermAssignmentsOwnProps {
    resource: Resource;
}

interface ResourceTermAssignmentsStateProps {
    notifications: AppNotification[];
}

interface ResourceTermAssignmentsDispatchProps {
    loadTermAssignments: (resource: Resource) => Promise<TermAssignmentInfo[]>;
    consumeNotification: (notification: AppNotification) => void;
}

interface ResourceTermAssignmentsState {
    assignments: TermAssignmentInfo[];
}

type ResourceTermAssignmentsProps =
    ResourceTermAssignmentsOwnProps
    & ResourceTermAssignmentsStateProps
    & ResourceTermAssignmentsDispatchProps
    & HasI18n;

function isOccurrence(item: TermAssignmentInfo) {
    return Utils.sanitizeArray(item.types).indexOf(VocabularyUtils.TERM_OCCURRENCE) !== -1;
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
            return;
        }
        const analysisFinishedNotification = this.props.notifications.find(n => n.source.type === NotificationType.TEXT_ANALYSIS_FINISHED);
        if (analysisFinishedNotification) {
            this.loadAssignments();
            this.props.consumeNotification(analysisFinishedNotification);
        }
    }

    private loadAssignments() {
        this.props.loadTermAssignments(this.props.resource).then(data => this.setState({assignments: data}));
    }

    public render() {
        const i18n = this.props.i18n;
        const assignments = this.renderAssignedTerms();
        const occurrencesClass = classNames({"resource-term-occurrences-container": assignments.length > 0});
        return <>
            <Row>
                <Col md={2}>
                    <Label className="attribute-label" title={i18n("resource.metadata.terms.assigned.tooltip")}>
                        {i18n("resource.metadata.terms.assigned")}
                    </Label>
                </Col>
                <Col md={10} className="resource-terms">
                    {assignments}
                </Col>
            </Row>
            <Row className={occurrencesClass}>
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
                            <TermLink
                                term={new Term({iri: rta.term.iri, label: rta.label, vocabulary: rta.vocabulary})}/>
                        </span>);
        });
        return items;
    }

    private renderTermOccurrences() {
        const items: JSX.Element[] = [];
        const occurrences = new Map<string, { term: Term, suggestedCount: number, assertedCount: number }>();
        this.state.assignments.filter(isOccurrence).forEach(rta => {
            if (!occurrences.has(rta.term.iri!)) {
                occurrences.set(rta.term.iri!, {
                    term: new Term({iri: rta.term.iri, label: rta.label, vocabulary: rta.vocabulary}),
                    suggestedCount: 0,
                    assertedCount: 0
                });
            }
            if (Utils.sanitizeArray(rta.types).indexOf(VocabularyUtils.SUGGESTED_TERM_OCCURRENCE) !== -1) {
                occurrences.get(rta.term.iri!)!.suggestedCount = (rta as ResourceTermOccurrences).count;
            } else {
                occurrences.get(rta.term.iri!)!.assertedCount = (rta as ResourceTermOccurrences).count;
            }
        });
        occurrences.forEach((v, k) => {
            items.push(<span key={k} className="resource-term-link m-term-occurrence">
                            <TermLink term={v.term}/>
                {v.assertedCount > 0 &&
                <Badge title={this.props.i18n("resource.metadata.terms.occurrences.confirmed.tooltip")}
                       className="m-term-occurrence-confirmed"
                       color="secondary">{this.props.formatMessage("resource.metadata.terms.occurrences.confirmed", {count: v.assertedCount})}</Badge>}
                {v.suggestedCount > 0 &&
                <Badge title={this.props.i18n("resource.metadata.terms.occurrences.suggested.tooltip")}
                       className="m-term-occurrence-suggested"
                       color="secondary">{this.props.formatMessage("resource.metadata.terms.occurrences.suggested", {count: v.suggestedCount})}</Badge>}
                        </span>);
        });
        return items;
    }
}

export default connect<ResourceTermAssignmentsStateProps, ResourceTermAssignmentsDispatchProps, ResourceTermAssignmentsOwnProps>((state: TermItState) => {
    return {
        notifications: state.notifications
    };
}, (dispatch: ThunkDispatch) => {
    return {
        loadTermAssignments: (resource: Resource) => dispatch(loadResourceTermAssignmentsInfo(VocabularyUtils.create(resource.iri))),
        consumeNotification: (notification: AppNotification) => dispatch(consumeNotification(notification))
    };
})(injectIntl(withI18n(ResourceTermAssignments)));