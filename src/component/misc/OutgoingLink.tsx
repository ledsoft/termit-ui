import * as React from "react";
import {injectIntl} from "react-intl";
import "intelligent-tree-select/lib/styles.css";
import withI18n, {HasI18n} from "../hoc/withI18n";
import "./OutgoingLink.scss";

interface OutgoingLinkProps extends HasI18n {
    label: string | JSX.Element,
    iri: string,
    showLink?: boolean;
    className?: string;
    id?: string;
}

export const OutgoingLink: React.SFC<OutgoingLinkProps> = (props: OutgoingLinkProps) => {
    return <span>{props.label}
        <a id={props.id} href={props.iri} target="_blank" style={{color: "gray"}} className={props.className}
           title={props.formatMessage("link.external.title", {url: props.iri})}>
            <span className={props.showLink ? "" : "hidden"}>↱</span></a>
    </span>;
};

OutgoingLink.defaultProps = {
    showLink: true
};

export default injectIntl(withI18n(OutgoingLink));
