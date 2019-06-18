import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Col, Label, Row} from "reactstrap";
import OutgoingLink from "../misc/OutgoingLink";
import Resource from "../../model/Resource";

interface ResourceMetadataProps extends HasI18n {
    resource: Resource;
}

class ResourceMetadata extends React.Component<ResourceMetadataProps> {
    constructor(props: ResourceMetadataProps) {
        super(props);
    }

    public render() {
        const i18n = this.props.i18n;
        const resource = this.props.resource || {};
        return <>
            <Row>
                <Col xl={2} md={4}>
                    <Label className="attribute-label">{i18n("asset.iri")}</Label>
                </Col>
                <Col xl={10} md={8}>
                    <Label id="resource-metadata-iri"><OutgoingLink iri={resource.iri} label={resource.iri}/></Label>
                </Col>
            </Row>
            <Row>
                <Col xl={2} md={4}>
                    <Label className="attribute-label">{i18n("asset.label")}</Label>
                </Col>
                <Col xl={10} md={8}>
                    <Label id="resource-metadata-label">{resource.label}</Label>
                </Col>
            </Row>
            <Row>
                <Col xl={2} md={4}>
                    <Label className="attribute-label">{i18n("resource.metadata.description")}</Label>
                </Col>
                <Col xl={10} md={8}>
                    <Label id="resource-metadata-description">{resource.description}</Label>
                </Col>
            </Row>
        </>;
    }
}

export default injectIntl(withI18n(ResourceMetadata));