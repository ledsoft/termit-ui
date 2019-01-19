import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import ResourceList from "./ResourceList";
import PanelWithActions from "../misc/PanelWithActions";
import {Link} from "react-router-dom";
import Routes from "../../util/Routes";
import {GoPlus} from "react-icons/go";

const Resources: React.SFC<HasI18n> = props => {
    const i18n = props.i18n;
    const actions = [<Link key="resource.management.create" to={Routes.createResource.path}
                           className="btn btn-primary btn-sm" title={i18n("resource.management.create.tooltip")}>
        <GoPlus/>&nbsp;{i18n("asset.create.button.text")}
    </Link>];
    return <PanelWithActions title={i18n("resource.management.resources")} actions={actions}>
        <ResourceList/>
    </PanelWithActions>;
};

export default injectIntl(withI18n(Resources));