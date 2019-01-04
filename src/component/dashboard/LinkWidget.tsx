import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Link} from "react-router-dom";

interface LinkWidgetProps extends HasI18n {
    to: any;
}

class LinkWidget extends React.Component<LinkWidgetProps> {
    public render() {
        // const i18n = this.props.i18n;

        return <Link to={this.props.to} className="widget card-body text-center">{this.props.children}</Link>;
    }
}

export default injectIntl(withI18n(LinkWidget));
