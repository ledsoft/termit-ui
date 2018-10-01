import * as React from 'react';
import "intelligent-tree-select/lib/styles.css";

interface OutgoingLinkProps{
    label: string | JSX.Element,
    iri : string
}

export default (props : OutgoingLinkProps) =>
    <span>{props.label}
        <a href={props.iri} target='_blank' style={{color:'gray'}}>↱</a>
    </span>;
