import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import ResourceLink from "./ResourceLink";
import {Col, Row, Table} from "reactstrap";
import {ThunkDispatch} from "../../util/Types";
import Resource from "../../model/Resource";
import {loadResources} from "../../action/AsyncActions";
import ResourceBadge from "../badge/ResourceBadge";
import classNames from "classnames";

interface ResourceListProps extends HasI18n {
    loadResources: () => void;
    resources: { [id: string]: Resource };
    selectedResource: Resource;
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
                    <Row>
                        <Col md={4} xl={2}>
                            <ResourceBadge resource={v}/>
                        </Col>
                        <Col md={8} xl={10} className={classNames("m-resource-list-item", {"bold": v.iri === this.props.selectedResource.iri})}>
                            <ResourceLink id={"resources-link-to-" + v.iri} resource={v}/>
                        </Col>
                    </Row>
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
        resources: state.resources,
        selectedResource: state.resource,
        intl: state.intl    // Forces component update on language switch
    };
}, (dispatch: ThunkDispatch) => {
    return {
        loadResources: () => dispatch(loadResources())
    };
})(injectIntl(withI18n(ResourceList)));