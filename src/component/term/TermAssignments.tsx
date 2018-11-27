import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import Term from "../../model/Term";
import TermAssignment from "../../model/TermAssignment";
import {connect} from "react-redux";
import {ThunkDispatch} from "../../util/Types";
import {loadTermAssignments} from "../../action/AsyncActions";
import {Badge, Button, Table} from "reactstrap";
import Routing from "../../util/Routing";
import Routes from "../../util/Routes";
import VocabularyUtils from "../../util/VocabularyUtils";
import TermItState from "../../model/TermItState";
import IntlData from "../../model/IntlData";
import "./TermAssignments.scss";

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

    private openResource = (resourceIri: string) => {
        const iri = VocabularyUtils.create(resourceIri);
        Routing.transitionTo(Routes.resourceDetail, {
            params: new Map([["name", iri.fragment]]),
            query: new Map([["namespace", iri.namespace!]])
        });
    };

    public render() {
        if (this.state.assignments.length === 0) {
            return null;
        }
        const i18n = this.props.i18n;
        return <div className="additional-metadata">
            <h5>{i18n("term.metadata.assignments.title")}</h5>
            <Table borderless={true}>
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
        const assignmentsPerResource = new Map<string, { count: number, descriptions: string, label: string }>();
        this.state.assignments.forEach(ass => {
            const resIri = ass.target.source.iri;
            let item;
            if (assignmentsPerResource.has(resIri)) {
                item = assignmentsPerResource.get(resIri)!;
                item.count += 1;
                item.descriptions += item.descriptions.length > 0 ? ("; " + ass.description) : ass.description;
            } else {
                item = {count: 1, descriptions: ass.description ? ass.description : "", label: ass.target.source.label};
            }
            assignmentsPerResource.set(resIri, item);
        });
        const result: JSX.Element[] = [];
        assignmentsPerResource.forEach((v, k) => {
            result.push(<tr key={k}>
                <td>
                    <Button color="link" onClick={this.openResource.bind(null, k)} className="link-to-resource"
                            title={this.props.i18n("term.metadata.assignments.resource.tooltip")}>
                        {v.label}
                    </Button>
                    {v.count > 1 && <Badge color="info"
                                           title={this.props.formatMessage("term.metadata.assignments.count.tooltip", {count: v.count})}>{v.count}</Badge>}
                </td>
                <td>{v.descriptions}</td>
            </tr>);
        });
        return result;
    }
}

// NOTE: Need to explicitly pass intl to the component in case of merging props interfaces, otherwise, language switching would not work
export default connect<{ intl: IntlData }, StoreDispatchProps, TermAssignmentsOwnProps>((state: TermItState) => {
    return {
        intl: state.intl
    };
}, (dispatch: ThunkDispatch) => {
    return {
        loadTermAssignments: (term: Term) => dispatch(loadTermAssignments(term))
    };
})(injectIntl(withI18n(TermAssignments)));
