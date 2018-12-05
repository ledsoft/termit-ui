import * as React from "react";
import {Col, Label, Row} from "reactstrap";
import AssetLabel from "../misc/AssetLabel";
import OutgoingLink from "../misc/OutgoingLink";

interface UnmappedPropertiesProps {
    properties: Map<string, string[]>;
}

const UnmappedProperties: React.SFC<UnmappedPropertiesProps> = (props: UnmappedPropertiesProps) => {
    if (props.properties.size === 0) {
        return null;
    }
    const result: JSX.Element[] = [];
    props.properties.forEach((values, k) => {
        const items = <ul className="term-items">{values.map(v => <li key={v}>{v}</li>)}</ul>;
        result.push(<Row key={k}>
            <Col xl={2} md={4}>
                <OutgoingLink
                    label={<Label className="attribute-label" title={k}><AssetLabel iri={k}
                                                                                    shrinkFullIri={true}/></Label>}
                    iri={k}/>
            </Col>
            <Col xl={10} md={8}>{items}</Col>
        </Row>);
    });
    return <div className="additional-metadata">{result}</div>;
};

export default UnmappedProperties;