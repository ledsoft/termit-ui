import * as React from 'react';
import {injectIntl} from 'react-intl';
import "intelligent-tree-select/lib/styles.css";
import withI18n, {HasI18n} from "../hoc/withI18n";

interface OutgoingLinkProps extends HasI18n {
    label: string | JSX.Element,
    iri: string
}

const OutgoingLink: React.SFC<OutgoingLinkProps> = (props: OutgoingLinkProps) => {
    return <span>{props.label}
        <a href={props.iri} target='_blank' style={{color: 'gray'}} title={props.i18n('link.external.title')}>↱</a>
    </span>;
};

export default injectIntl(withI18n(OutgoingLink));
