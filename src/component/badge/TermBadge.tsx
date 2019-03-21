import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Badge} from "reactstrap";

interface TermBadgeProps extends HasI18n {
    className?: string;
}

const TermBadge: React.SFC<TermBadgeProps> = (props: TermBadgeProps) => <Badge color="dark"
                                                                               className={props.className}>{props.i18n("type.term")}</Badge>;


export default injectIntl(withI18n(TermBadge));