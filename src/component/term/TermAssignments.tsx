import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import Term from "../../model/Term";
import TermAssignment from "../../model/TermAssignment";
import {connect} from "react-redux";
import {ThunkDispatch} from "../../util/Types";
import {loadTermAssignments} from "../../action/AsyncActions";
import {Badge, Table, UncontrolledTooltip} from "reactstrap";
import TermItState from "../../model/TermItState";
import IntlData from "../../model/IntlData";
import "./TermAssignments.scss";
import Resource, {ResourceData} from "../../model/Resource";
import TermOccurrence from "../../model/TermOccurrence";
import ResourceLink from "../resource/ResourceLink";
import {GoCheck, GoInfo, GoX} from "react-icons/go";

interface TermAssignmentsOwnProps {
    term: Term;
    onAssignmentsLoad: (assignmentsCount: number) => void;
}

interface StoreDispatchProps {
    loadTermAssignments: (term: Term) => Promise<TermAssignment[] | any>;
}

interface TermAssignmentsState {
    assignments: TermAssignment[];
}

type TermAssignmentsProps = TermAssignmentsOwnProps & HasI18n & StoreDispatchProps;

export class TermAssignments extends React.Component<TermAssignmentsProps, TermAssignmentsState> {
    constructor(props: TermAssignmentsProps) {
        super(props);
        this.state = {
            assignments: []
        };
    }

    public componentDidMount(): void {
        this.props.loadTermAssignments(this.props.term).then((assignments: TermAssignment[]) => this.setAssignments(assignments));
    }

    public componentDidUpdate(prevProps: Readonly<TermAssignmentsProps>): void {
        if (this.props.term.iri !== prevProps.term.iri) {
            this.props.loadTermAssignments(this.props.term).then((assignments: TermAssignment[]) => this.setAssignments(assignments));
        }
    }

    private setAssignments = (assignments: TermAssignment[]) => {
        this.setState({assignments});
        this.props.onAssignmentsLoad(assignments.length);
    };

    public render() {
        const i18n = this.props.i18n;
        if (this.state.assignments.length === 0) {
            return <div
                className="additional-metadata-container italics">{i18n("term.metadata.assignments.empty")}</div>;
        }
        return <div className="additional-metadata-container">
            <Table borderless={true}>
                <thead>
                <tr>
                    <th className="col-xs-9">{i18n("type.resource")}</th>
                    <th className="col-xs-1 text-center">
                        {i18n("term.metadata.assignments.assignment")}&nbsp;
                        <GoInfo id="term-metadata-assignments-assignment-help"/>
                        <UncontrolledTooltip target="term-metadata-assignments-assignment-help" placement="right">
                            {i18n("term.metadata.assignments.assignment.help")}
                        </UncontrolledTooltip>
                    </th>
                    <th className="col-xs-1 text-center">
                        {i18n("term.metadata.assignments.occurrence")}&nbsp;
                        <GoInfo id="term-metadata-assignments-occurrence-help"/>
                        <UncontrolledTooltip target="term-metadata-assignments-occurrence-help" placement="right">
                            {i18n("term.metadata.assignments.occurrence.help")}
                        </UncontrolledTooltip>
                    </th>
                    <th className="col-xs-1 text-center">
                        {i18n("term.metadata.assignments.suggestedOccurrence")}&nbsp;
                        <GoInfo id="term-metadata-assignments-suggestedOccurrence-help"/>
                        <UncontrolledTooltip target="term-metadata-assignments-suggestedOccurrence-help"
                                             placement="left">
                            {i18n("term.metadata.assignments.suggestedOccurrence.help")}
                        </UncontrolledTooltip>
                    </th>
                </tr>
                </thead>
                <tbody>
                {this.renderAssignments()}
                </tbody>
            </Table>
        </div>;
    }

    private renderAssignments() {
        const assignmentsPerResource = this.mapAssignments();
        const result: JSX.Element[] = [];
        assignmentsPerResource.forEach((v, k) => {
            result.push(<tr key={k}>
                <td>
                    <ResourceLink resource={new Resource(v.resource)}/>
                </td>
                <td className="text-center">
                    {v.assignmentCount > 0 ? <span
                            title={this.props.i18n("term.metadata.assignments.assignment.assigned")}><GoCheck/></span> :
                        <span
                            title={this.props.i18n("term.metadata.assignments.assignment.not.assigned")}><GoX/></span>}
                </td>
                <td className="text-center">
                    {this.renderCheckWithCount(v.occurrenceCount)}
                </td>
                <td className="text-center">
                    {this.renderCheckWithCount(v.suggestedOccurrenceCount)}
                </td>
            </tr>);
        });
        return result;
    }

    private mapAssignments() {
        const assignmentsPerResource = new Map<string, { resource: ResourceData, assignmentCount: number, occurrenceCount: number, suggestedOccurrenceCount: number }>();
        this.state.assignments.forEach(ass => {
            const resIri = ass.target.source.iri;
            let item;
            if (assignmentsPerResource.has(resIri)) {
                item = assignmentsPerResource.get(resIri)!;
            } else {
                item = {
                    resource: ass.target.source,
                    assignmentCount: 0,
                    occurrenceCount: 0,
                    suggestedOccurrenceCount: 0
                };
            }
            if (ass instanceof TermOccurrence) {
                if (ass.isSuggested()) {
                    item.suggestedOccurrenceCount += 1;
                } else {
                    item.occurrenceCount += 1;
                }
            } else {
                item.assignmentCount += 1;
            }
            assignmentsPerResource.set(resIri, item);
        });
        return assignmentsPerResource;
    }

    private renderCheckWithCount(count: number) {
        if (count > 0) {
            return <>
                <GoCheck/>&nbsp;
                <Badge color="secondary" title={this.props.formatMessage("term.metadata.assignments.count.tooltip", {
                    count
                })}>{count}</Badge>
            </>;
        }
        return <span title={this.props.i18n("term.metadata.assignments.count.zero.tooltip")}><GoX/></span>;
    }
}

// NOTE: Need to explicitly pass intl to the component in case of merging props interfaces, otherwise, language
// switching would not work
export default connect<{ intl: IntlData }, StoreDispatchProps, TermAssignmentsOwnProps>((state: TermItState) => {
    return {
        intl: state.intl
    };
}, (dispatch: ThunkDispatch) => {
    return {
        loadTermAssignments: (term: Term) => dispatch(loadTermAssignments(term))
    };
})(injectIntl(withI18n(TermAssignments)));
