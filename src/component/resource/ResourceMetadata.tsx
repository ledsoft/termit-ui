import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Col, Label, Row} from "reactstrap";
import OutgoingLink from "../misc/OutgoingLink";
import Resource from "../../model/Resource";

interface ResourceMetadataProps extends HasI18n {
    resource : Resource
}

class ResourceMetadata extends React.Component<ResourceMetadataProps> {
    constructor(props: ResourceMetadataProps) {
        super(props);
    }

    public render() {
        const i18n = this.props.i18n;
        const resource = this.props.resource;
        return <div className='metadata-panel'>
            <Row>
                <Col md={2}>
                    <Label className='attribute-label'>{i18n('resource.metadata.identifier')}</Label>
                </Col>
                <Col md={10}>
                    <OutgoingLink iri={resource.iri} label={resource.iri}/>
                </Col>
            </Row>
            <Row>
                <Col md={2}>
                    <Label className='attribute-label'>{i18n('resource.metadata.label')}</Label>
                </Col>
                <Col md={10}>
                    {resource.label}
                </Col>
            </Row>
            <Row>
                <Col md={2}>
                    <Label className='attribute-label'>{i18n('resource.metadata.comment')}</Label>
                </Col>
                <Col md={10}>
                    {resource.comment}
                </Col>
            </Row>
        </div>;
    }
}

export default injectIntl(withI18n(ResourceMetadata));