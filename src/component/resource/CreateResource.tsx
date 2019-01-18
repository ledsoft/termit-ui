import * as React from "react";
import {injectIntl} from "react-intl";
import Resource, {ResourceData} from "../../model/Resource";
import {AbstractCreateAsset, AbstractCreateAssetState} from "../asset/AbstractCreateAsset";
import withI18n, {HasI18n} from "../hoc/withI18n";
import Constants from "../../util/Constants";
import Routing from "../../util/Routing";
import Routes from "../../util/Routes";
import {Button, ButtonToolbar, Card, CardBody, CardHeader, Col, Form, Row} from "reactstrap";
import CustomInput from "../misc/CustomInput";
import TextArea from "../misc/TextArea";
import {connect} from "react-redux";
import {ThunkDispatch} from "../../util/Types";
import {createResource} from "../../action/AsyncActions";

interface CreateResourceProps extends HasI18n {
    onCreate: (resource: Resource) => void;
}

interface CreateResourceState extends AbstractCreateAssetState, ResourceData {
    description: string;
}

export class CreateResource extends AbstractCreateAsset<CreateResourceProps, CreateResourceState> {

    constructor(props: CreateResourceProps) {
        super(props);
        this.state = {
            iri: "",
            label: "",
            description: "",
            generateIri: true
        };
    }

    protected get identifierGenerationEndpoint(): string {
        return Constants.API_PREFIX + "/resources/identifier";
    }

    private onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({description: e.currentTarget.value});
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
                                <Button onClick={this.onCreate} color="success" size="sm"
                                        disabled={this.state.label.trim().length === 0}>{i18n("create")}</Button>
                                <Button onClick={CreateResource.onCancel} color="secondary"
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
