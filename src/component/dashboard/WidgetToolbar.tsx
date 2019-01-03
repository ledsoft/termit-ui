import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import Routes from "../../util/Routes";
import LinkWidget from "./LinkWidget";

class WidgetToolbar extends React.Component<HasI18n> {
    public render() {
        // const i18n = this.props.i18n;

        return <nav className="widget-toolbar container-fluid row justify-content-center mb-3">
            <LinkWidget to={Routes.createVocabulary.link()}>Foo</LinkWidget>
            <LinkWidget to={Routes.createVocabulary.link()}>Bar</LinkWidget>
            <LinkWidget to={Routes.createVocabulary.link()}>Baz</LinkWidget>
        </nav>;
    }
}

export default injectIntl(withI18n(WidgetToolbar));
