import * as React from "react";
import {Col, Label, Row} from "reactstrap";
import AssetLabel from "../misc/AssetLabel";
import OutgoingLink from "../misc/OutgoingLink";

interface UnmappedPropertiesProps {
    properties: Map<string, string[]>;
}

const UnmappedProperties: React.SFC<UnmappedPropertiesProps> = (props: UnmappedPropertiesProps) => {
    const result: JSX.Element[] = [];
    props.properties.forEach((values, k) => {
        const items = <ul className="term-items">{values.map(v => <li key={v}>{v}</li>)}</ul>;
        result.push(<Row key={k}>
            <Col xl={2} md={4}>
                <OutgoingLink label={<Label className="attribute-label"><AssetLabel iri={k}/></Label>} iri={k}/>
            </Col>
            <Col xl={10} md={8}>{items}</Col>
        </Row>);
    });
    return <div>{result}</div>;
};

export default UnmappedProperties;