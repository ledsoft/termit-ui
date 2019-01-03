import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Card} from "reactstrap";
import {Link} from "react-router-dom";

interface LinkWidgetProps extends HasI18n {
    to: any;
}

class LinkWidget extends React.Component<LinkWidgetProps> {
    public render() {
        // const i18n = this.props.i18n;

        return <Card class="col" style={{maxWidth: "10em"}}>
                <Link to={this.props.to} className="card-body text-center">{this.props.children}</Link>
            </Card>;
    }
}

export default injectIntl(withI18n(LinkWidget));
