import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import Term from "../../model/Term";
import TermAssignment from "../../model/TermAssignment";
import {connect} from "react-redux";
import {ThunkDispatch} from "../../util/Types";
import {loadTermAssignments} from "../../action/AsyncActions";
import {Table} from "reactstrap";

interface TermAssignmentsOwnProps {
    term: Term;
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
        this.props.loadTermAssignments(this.props.term).then((assignments: TermAssignment[]) => this.setState({assignments}));
    }

    public componentDidUpdate(prevProps: Readonly<TermAssignmentsProps>): void {
        if (this.props.term.iri !== prevProps.term.iri) {
            this.props.loadTermAssignments(this.props.term).then((assignments: TermAssignment[]) => this.setState({assignments}));
        }
    }

    public render() {
        if (this.state.assignments.length === 0) {
            return null;
        }
        const i18n = this.props.i18n;
        return <div className="additional-metadata">
            <h5>{i18n("term.metadata.assignments.title")}</h5>
            <Table striped={true}>
                <thead>
                <tr>
                    <th>{i18n("term.metadata.assignments.resource")}</th>
                    <th>{i18n("term.metadata.assignments.description")}</th>
                </tr>
                </thead>
                <tbody>
                {this.renderAssignments()}
                </tbody>
            </Table>
        </div>;
    }

    private renderAssignments() {
        return this.state.assignments.map(ass => {
            return <tr key={ass.iri}>
                <td>{ass.target.source.label}</td>
                <td>{ass.description}</td>
            </tr>;
        });
    }
}

export default connect<null, StoreDispatchProps, TermAssignmentsOwnProps>(null, (dispatch: ThunkDispatch) => {
    return {
        loadTermAssignments: (term: Term) => dispatch(loadTermAssignments(term))
    };
})(injectIntl(withI18n(TermAssignments)));
