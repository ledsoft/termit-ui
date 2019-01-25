import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import Routes from "../../util/Routes";
import LinkWidget from "./LinkWidget";
import {Nav, NavItem} from "reactstrap";
import "./WidgetToolbar.scss";

class WidgetToolbar extends React.Component<HasI18n> {
    public render() {
        const i18n = this.props.i18n;

        return <Nav className="widget-toolbar justify-content-center mb-4">
            <NavItem className="card mx-1">
                <LinkWidget to={Routes.createVocabulary.path}
                            title={i18n("vocabulary.vocabularies.create.tooltip")}>{i18n("dashboard.create-vocabulary.tile")}</LinkWidget>
            </NavItem>
            <NavItem className="card mx-1">
                <LinkWidget to={Routes.createResource.path}
                            title={i18n("resource.management.create.tooltip")}>{i18n("dashboard.create-resource.tile")}</LinkWidget>
            </NavItem>
        </Nav>;
    }
}

export default injectIntl(withI18n(WidgetToolbar));
