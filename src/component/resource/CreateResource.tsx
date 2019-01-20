import * as React from "react";
import {injectIntl} from "react-intl";
import Resource, {ResourceData} from "../../model/Resource";
import {AbstractCreateAsset, AbstractCreateAssetState} from "../asset/AbstractCreateAsset";
import withI18n, {HasI18n} from "../hoc/withI18n";
import Constants from "../../util/Constants";
import Routing from "../../util/Routing";
import Routes from "../../util/Routes";
import {Button, ButtonGroup, ButtonToolbar, Card, CardBody, CardHeader, Col, Form, Label, Row} from "reactstrap";
import CustomInput from "../misc/CustomInput";
import TextArea from "../misc/TextArea";
import {connect} from "react-redux";
import {ThunkDispatch} from "../../util/Types";
import {createResource} from "../../action/AsyncActions";
import VocabularyUtils from "../../util/VocabularyUtils";

interface CreateResourceProps extends HasI18n {
    onCreate: (resource: Resource) => void;
}

interface CreateResourceState extends AbstractCreateAssetState, ResourceData {
    description: string;
    types: string;
}

export class CreateResource extends AbstractCreateAsset<CreateResourceProps, CreateResourceState> {

    constructor(props: CreateResourceProps) {
        super(props);
        this.state = {
            iri: "",
            label: "",
            description: "",
            types: VocabularyUtils.RESOURCE,
            generateIri: true
        };
    }

    protected get identifierGenerationEndpoint(): string {
        return Constants.API_PREFIX + "/resources/identifier";
    }

    private onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({description: e.currentTarget.value});
    };

    private onTypeSelect = (type: string) => {
        this.setState({types: type});
    };

    private onCreate = (): void => {
        const {generateIri, ...data} = this.state;
        this.props.onCreate(new Resource(data));
    };

    private static onCancel(): void {
        Routing.transitionTo(Routes.resources);
    }

    public render() {
        const i18n = this.props.i18n;
        return <Card>
            <CardHeader color="info">
                <h5>{i18n("resource.create.title")}</h5>
            </CardHeader>
            <CardBody>
                <Form>
                    <Row>
                        <Col xl={6} md={12}>
                            <Row>
                                <Col>
                                    <Label className="attribute-label">{i18n("resource.create.type")}</Label>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <ButtonGroup className="d-flex form-group">
                                        <Button color="info" size="sm" className="w-100 create-resource-type-select" outline={true}
                                                onClick={this.onTypeSelect.bind(null, VocabularyUtils.RESOURCE)}
                                                active={this.state.types === VocabularyUtils.RESOURCE}>{i18n("type.resource")}</Button>
                                        <Button color="info" size="sm" className="w-100 create-resource-type-select" outline={true}
                                                onClick={this.onTypeSelect.bind(null, VocabularyUtils.DATASET)}
                                                active={this.state.types === VocabularyUtils.DATASET}>{i18n("type.dataset")}</Button>
                                        <Button color="info" size="sm" className="w-100 create-resource-type-select" outline={true}
                                                onClick={this.onTypeSelect.bind(null, VocabularyUtils.DOCUMENT)}
                                                active={this.state.types === VocabularyUtils.DOCUMENT}>{i18n("type.document")}</Button>
                                        <Button color="info" size="sm" className="w-100 create-resource-type-select" outline={true}
                                                onClick={this.onTypeSelect.bind(null, VocabularyUtils.FILE)}
                                                active={this.state.types === VocabularyUtils.FILE}>{i18n("type.file")}</Button>
                                    </ButtonGroup>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={6} md={12}>
                            <CustomInput name="create-resource.label" label={i18n("asset.label")}
                                         value={this.state.label}
                                         onChange={this.onLabelChange}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={6} md={12}>
                            <CustomInput name="create-resource.iri" label={i18n("asset.iri")}
                                         value={this.state.iri}
                                         onChange={this.onIriChange} help={i18n("asset.create.iri.help")}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={6} md={12}>
                            <TextArea name="create-resource.description" label={i18n("resource.metadata.description")}
                                      type="textarea" rows={3} value={this.state.description} help={i18n("optional")}
                                      onChange={this.onDescriptionChange}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={6} md={12}>
                            <ButtonToolbar className="pull-right">
                                <Button name="create-resource.submit" onClick={this.onCreate} color="success" size="sm"
                                        disabled={this.state.label.trim().length === 0}>{i18n("create")}</Button>
                                <Button name="create-resource.cancel" onClick={CreateResource.onCancel} color="secondary"
                                        size="sm">{i18n("cancel")}</Button>
                            </ButtonToolbar>
                        </Col>
                    </Row>
                </Form>
            </CardBody>
        </Card>;
    }
}

export default connect(undefined, (dispatch: ThunkDispatch) => {
    return {
        onCreate: (resource: Resource) => dispatch(createResource(resource))
    };
})(injectIntl(withI18n(CreateResource)));
