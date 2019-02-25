import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Link} from "react-router-dom";

interface LinkWidgetProps extends HasI18n {
    to: any;
    title?: string;
    children: any;
    id?: string;
}

const LinkWidget: React.SFC<LinkWidgetProps> = (props: LinkWidgetProps) => <Link id={props.id} to={props.to}
                                                                                 title={props.title}
                                                                                 className="widget card-body text-center">{props.children}</Link>;

export default injectIntl(withI18n(LinkWidget));
