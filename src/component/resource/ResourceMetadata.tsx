import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Col, Label, Row} from "reactstrap";
import OutgoingLink from "../misc/OutgoingLink";
import Resource from "../../model/Resource";
import TermLink from "../term/TermLink";

interface ResourceMetadataProps extends HasI18n {
    resource: Resource;
}

class ResourceMetadata extends React.Component<ResourceMetadataProps> {
    constructor(props: ResourceMetadataProps) {
        super(props);
    }

    protected clear = () => {
        this.setState({searchString: "", results: null});
    };

    public render() {
        const i18n = this.props.i18n;
        const resource = this.props.resource || {};
        const resourceTerms = resource.terms || [];
        return <div className="metadata-panel">
            <Row>
                <Col md={2}>
                    <Label className="attribute-label">{i18n("asset.iri")}</Label>
                </Col>
                <Col md={10}>
                    <Label id="resource-metadata-iri"><OutgoingLink iri={resource.iri} label={resource.iri}/></Label>
                </Col>
            </Row>
            <Row>
                <Col md={2}>
                    <Label className="attribute-label">{i18n("asset.label")}</Label>
                </Col>
                <Col md={10}>
                    <Label id="resource-metadata-label">{resource.label}</Label>
                </Col>
            </Row>
            <Row>
                <Col md={2}>
                    <Label className="attribute-label">{i18n("resource.metadata.description")}</Label>
                </Col>
                <Col md={10}>
                    <Label>{resource.description}</Label>
                </Col>
            </Row>
            <Row>
                <Col md={2}>
                    <Label className="attribute-label">{i18n("resource.metadata.terms")}</Label>
                </Col>
                <Col md={10} className="resource-terms">
                    {resourceTerms.map(r =>
                        <span key={r.iri} className="resource-term-link">
                            <TermLink term={r}/>
                        </span>
                    )}
                </Col>
            </Row>
        </div>;
    }
}

export default injectIntl(withI18n(ResourceMetadata));