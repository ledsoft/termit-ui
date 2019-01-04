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

        return <Nav className="widget-toolbar justify-content-center mb-3">
            <NavItem className="card mx-1">
                <LinkWidget to={Routes.vocabularies.link()}>{i18n("main.nav.vocabularies")}</LinkWidget>
            </NavItem>
            <NavItem className="card mx-1">
                <LinkWidget to={Routes.resources.link()}>{i18n("main.nav.resources")}</LinkWidget>
            </NavItem>
            <NavItem className="card mx-1">
                <LinkWidget to={Routes.statistics.link()}>{i18n("main.nav.statistics")}</LinkWidget>
            </NavItem>
        </Nav>;
    }
}

export default injectIntl(withI18n(WidgetToolbar));
