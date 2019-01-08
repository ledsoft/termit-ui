import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Badge} from "reactstrap";


const TermBadge: React.SFC<HasI18n> = (props: HasI18n) => <Badge
    color="dark">{props.i18n("type.term")}</Badge>;


export default injectIntl(withI18n(TermBadge));