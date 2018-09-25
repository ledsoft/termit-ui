import * as React from 'react';
import "intelligent-tree-select/lib/styles.css";

interface OutgoingLinkProps{
    label: string,
    iri : string
}

export default (props : OutgoingLinkProps) =>
    <span>{props.label}
        <a href={props.iri} target='_blank'>↱</a>
    </span>;
