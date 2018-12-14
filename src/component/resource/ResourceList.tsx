import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import ResourceLink from "./ResourceLink";
import {Table} from "reactstrap";
import {ThunkDispatch} from "../../util/Types";
import Resource from "../../model/Resource";
import {loadResources} from "../../action/AsyncActions";

interface ResourceListProps extends HasI18n {
    loadResources: () => void,
    resources: { [id: string]: Resource }
}

class ResourceList extends React.Component<ResourceListProps> {

    public componentDidMount() {
        this.props.loadResources();
    }

    public render() {
        const resources = Object.keys(this.props.resources).map((v) => this.props.resources[v]);
        const rows = resources.map(v =>
            <tr key={v.iri}>
                <td>
                    <ResourceLink resource={v}/>
                </td>
            </tr>
        );
        return <div>
            <Table borderless={true}>
                <tbody>
                {rows}
                </tbody>
            </Table>
        </div>
    }
}

export default connect((state: TermItState) => {
    return {
        resources: state.resources
    };
}, (dispatch: ThunkDispatch) => {
    return {
        loadResources: () => dispatch(loadResources())
    };
})(injectIntl(withI18n(ResourceList)));