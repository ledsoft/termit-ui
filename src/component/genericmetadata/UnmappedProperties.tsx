import * as React from "react";
import {injectIntl} from "react-intl";
import {Col, Label, Row} from "reactstrap";
import AssetLabel from "../misc/AssetLabel";
import OutgoingLink from "../misc/OutgoingLink";
import withI18n, {HasI18n} from "../hoc/withI18n";

declare type PropertyValueType = { iri: string } | string;

interface UnmappedPropertiesProps extends HasI18n {
    properties: Map<string, PropertyValueType[]>;
    showInfoOnEmpty?: boolean;
}

const UnmappedProperties: React.FC<UnmappedPropertiesProps> = (props: UnmappedPropertiesProps) => {
    if (props.properties.size === 0) {
        return props.showInfoOnEmpty ?
            <div className="additional-metadata-container italics">{props.i18n("properties.empty")}</div> : null;
    }
    const result: JSX.Element[] = [];
    props.properties.forEach((values, k) => {
        const items = <ul className="term-items">{values.map((v: PropertyValueType) => {
            const val: string = (v as {iri: string}).iri  ? (v as {iri: string}).iri : v as string;
            return <li key={val}>{val}</li>;
        })}</ul>;
        result.push(<Row key={k}>
            <Col xl={3} md={4}>
                <OutgoingLink
                    label={<Label className="attribute-label" title={k}><AssetLabel iri={k}
                                                                                    shrinkFullIri={true}/></Label>}
                    iri={k}/>
            </Col>
            <Col xl={9} md={8}>{items}</Col>
        </Row>);
    });
    return <div className="additional-metadata-container">{result}</div>;
};

UnmappedProperties.defaultProps = {
    showInfoOnEmpty: false
};

export default injectIntl(withI18n(UnmappedProperties));
