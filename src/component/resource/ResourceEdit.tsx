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
    comment?: string;
    terms: Term[];
}

export class ResourceEdit extends React.Component<ResourceEditProps, ResourceEditState> {
    constructor(props: ResourceEditProps) {
        super(props);
        this.state = {
            label: props.resource.label,
            comment: props.resource.comment,
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
        change[e.currentTarget.name.endsWith("label") ? "label" : "comment"] = e.currentTarget.value;
        this.setState(change);
    };

    private onTagsChange = (newChildren: Term[]) => {
        this.setState({terms: newChildren});
    };

    public onSave = () => {
        const newResource = new Resource(this.props.resource);
        newResource.label = this.state.label;
        newResource.comment = this.state.comment;
        newResource.terms = this.state.terms;
        this.props.save(newResource);
    };

    public render() {
        const i18n = this.props.i18n;
        return <div className="metadata-panel">
            <Form>
                <Row>
                    <Col xl={6} md={12}>
                        <CustomInput label={i18n("resource.metadata.identifier")} value={this.props.resource.iri}
                                     disabled={true}/>
                    </Col>
                </Row>
                <Row>
                    <Col xl={6} md={12}>
                        <CustomInput name="resource-edit-label" label={i18n("resource.metadata.label")}
                                     value={this.state.label} onChange={this.onChange}/>
                    </Col>
                </Row>
                <Row>
                    <Col xl={6} md={12}>
                        <TextArea name="resource-edit-comment" label={i18n("resource.metadata.comment")} rows={3}
                                  value={this.state.comment} onChange={this.onChange}/>
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
                            <Button onClick={this.onSave} color="success" size="sm">{i18n("save")}</Button>
                            <Button onClick={this.props.cancel} key="cancel" color="secondary" size="sm">{i18n("cancel")}</Button>
                        </ButtonToolbar>
                    </Col>
                </Row>
            </Form>
        </div>;
    }
}

export default injectIntl(withI18n(ResourceEdit));
