import * as React from "react";
import {injectIntl} from "react-intl";
import {Col} from "reactstrap";
import withI18n, {HasI18n} from "../hoc/withI18n";
import Resources from "./Resources";
import {Switch} from "react-router";
import Routes from "../../util/Routes";
import ResourceSummary from "./ResourceSummary";
import DynamicBreadcrumbRoute from "../breadcrumb/DynamicBreadcrumbRoute";
import BreadcrumbRoute from "../breadcrumb/BreadcrumbRoute";
import CreateResource from "./CreateResource";
import ResourceFileDetail from "./ResourceFileDetail";

class ResourceManagement extends React.Component<HasI18n> {
    constructor(props: HasI18n) {
        super(props);
    }

    public render() {
        const i18n = this.props.i18n;
        return <Switch>
            <BreadcrumbRoute title={i18n("annotator.annotate-content")} path={Routes.annotateFile.path}
                             component={ResourceFileDetail}/>
            <div>
                <h2 className="page-header">{i18n("resource.management")}</h2>
                <div className="row">
                    <Col md={4}>
                        <Resources/>
                    </Col>
                    <Col md={8}>
                        <Switch>
                            <BreadcrumbRoute title={i18n("resource.create.title")} path={Routes.createResource.path}
                                             component={CreateResource}/>
                            <DynamicBreadcrumbRoute asset="resource" path={Routes.resourceSummary.path}
                                                    component={ResourceSummary} exact={true} includeSearch={true}/>
                        </Switch>
                    </Col>
                </div>
            </div>
        </Switch>;


    }
}

export default injectIntl(withI18n(ResourceManagement));