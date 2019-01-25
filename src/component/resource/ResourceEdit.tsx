import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Button, ButtonToolbar, Col, Form, Row} from "reactstrap";
import Resource from "../../model/Resource";
import ResourceRelatedTermsEdit from "./ResourceRelatedTermsEdit";
import Term from "../../model/Term";
import CustomInput from "../misc/CustomInput";
import TextArea from "../misc/TextArea";

interface ResourceEditProps extends HasI18n {
    resource: Resource;
    save: (resource: Resource) => void;
    cancel: () => void;
}

interface ResourceEditState {
    label: string;
    description?: string;
    terms: Term[];
}

export class ResourceEdit extends React.Component<ResourceEditProps, ResourceEditState> {
    constructor(props: ResourceEditProps) {
        super(props);
        this.state = {
            label: props.resource.label,
            description: props.resource.description,
            terms: props.resource.terms
        };
    }

    public componentDidUpdate(prevProps: ResourceEditProps) {
        if (prevProps.resource.terms !== this.props.resource.terms) {
            this.setState({terms: this.props.resource.terms});
        }
    }

    private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const change = {};
        change[e.currentTarget.name.endsWith("label") ? "label" : "description"] = e.currentTarget.value;
        this.setState(change);
    };

    private onTagsChange = (newChildren: Term[]) => {
        this.setState({terms: newChildren});
    };

    public onSave = () => {
        const newResource = new Resource(this.props.resource);
        newResource.label = this.state.label;
        newResource.description = this.state.description;
        newResource.terms = this.state.terms;
        this.props.save(newResource);
    };

    public render() {
        const i18n = this.props.i18n;
        return <div className="metadata-panel">
            <Form>
                <Row>
                    <Col xl={6} md={12}>
                        <CustomInput label={i18n("asset.iri")} value={this.props.resource.iri}
                                     disabled={true}/>
                    </Col>
                </Row>
                <Row>
                    <Col xl={6} md={12}>
                        <CustomInput name="resource-edit-label" label={i18n("asset.label")}
                                     value={this.state.label} onChange={this.onChange}/>
                    </Col>
                </Row>
                <Row>
                    <Col xl={6} md={12}>
                        <TextArea name="resource-edit-description" label={i18n("resource.metadata.description")} rows={3}
                                  value={this.state.description} onChange={this.onChange}/>
                    </Col>
                </Row>
                <Row>
                    <Col xl={6} md={12}>
                        <ResourceRelatedTermsEdit
                            terms={this.state.terms}
                            onChange={this.onTagsChange}/>
                    </Col>
                </Row>

                <Row>
                    <Col xl={6} md={12}>
                        <ButtonToolbar className="pull-right">
                            <Button name="edit-resource.submit" onClick={this.onSave} color="success" size="sm">{i18n("save")}</Button>
                            <Button name="edit-resource.cancel" onClick={this.props.cancel} key="cancel" color="secondary" size="sm">{i18n("cancel")}</Button>
                        </ButtonToolbar>
                    </Col>
                </Row>
            </Form>
        </div>;
    }
}

export default injectIntl(withI18n(ResourceEdit));
