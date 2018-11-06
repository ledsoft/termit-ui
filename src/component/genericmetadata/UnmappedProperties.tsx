import * as React from 'react';
import {Col, Label, Row} from "reactstrap";

interface UnmappedPropertiesProps {
    properties: Map<string, string[]>;
}

const UnmappedProperties: React.SFC<UnmappedPropertiesProps> = (props: UnmappedPropertiesProps) => {
    const result: JSX.Element[] = [];
    props.properties.forEach((values, k) => values.forEach(value => result.push(<Row key={k + '-' + value}>
        <Col md={2}><Label className='attribute-label'>{k}</Label></Col>
        <Col md={2}><Label>{value}</Label></Col>
    </Row>)));

    return <div>{result}</div>;
};

export default UnmappedProperties;