import * as React from "react";
import {injectIntl} from "react-intl";
import {Col, Label, Row} from "reactstrap";
import AssetLabel from "../misc/AssetLabel";
import OutgoingLink from "../misc/OutgoingLink";
import withI18n, {HasI18n} from "../hoc/withI18n";

interface UnmappedPropertiesProps extends HasI18n {
    properties: Map<string, string[]>;
    showInfoOnEmpty?: boolean;
}

const UnmappedProperties: React.SFC<UnmappedPropertiesProps> = (props: UnmappedPropertiesProps) => {
    if (props.properties.size === 0) {
        return props.showInfoOnEmpty ?
            <div className="additional-metadata-container italics">{props.i18n("properties.empty")}</div> : null;
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
    return <div className="additional-metadata-container">{result}</div>;
};

UnmappedProperties.defaultProps = {
    showInfoOnEmpty: false
};

export default injectIntl(withI18n(UnmappedProperties));