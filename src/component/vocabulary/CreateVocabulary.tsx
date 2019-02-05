import * as React from "react";
import {injectIntl} from "react-intl";
import {Button, ButtonToolbar, Card, CardBody, CardHeader, Col, Form, Row} from "reactstrap";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {connect} from "react-redux";
import CustomInput from "../misc/CustomInput";
import Routes from "../../util/Routes";
import Routing from "../../util/Routing";
import Constants from "../../util/Constants";
import withLoading from "../hoc/withLoading";
import {createVocabulary} from "../../action/AsyncActions";
import Vocabulary from "../../model/Vocabulary";
import {ThunkDispatch} from "../../util/Types";
import TextArea from "../misc/TextArea";
import {AbstractCreateAsset, AbstractCreateAssetState} from "../asset/AbstractCreateAsset";

interface CreateVocabularyProps extends HasI18n {
    onCreate: (vocabulary: Vocabulary) => void
}

interface CreateVocabularyState extends AbstractCreateAssetState {
    comment: string;
}

export class CreateVocabulary extends AbstractCreateAsset<CreateVocabularyProps, CreateVocabularyState> {
    constructor(props: CreateVocabularyProps) {
        super(props);
        this.state = {
            label: "",
            comment: "",
            iri: "",
            generateIri: true
        };
    }

    protected get identifierGenerationEndpoint(): string {
        return Constants.API_PREFIX + "/vocabularies/identifier";
    }

    private onCommentChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({comment: e.currentTarget.value});
    };

    public onCreate = (): void => {
        this.props.onCreate(new Vocabulary({
            label: this.state.label,
            iri: this.state.iri,
            comment: this.state.comment
        }));
    };

    private static onCancel(): void {
        Routing.transitionTo(Routes.vocabularies);
    }

    public render() {
        const i18n = this.props.i18n;
        return <Card>
            <CardHeader color="info">
                <h5>{i18n("vocabulary.create.title")}</h5>
            </CardHeader>
            <CardBody>
                <Form>
                    <Row>
                        <Col xl={6} md={12}>
                            <CustomInput name="create-vocabulary.label" label={i18n("asset.label")}
                                         value={this.state.label}
                                         onChange={this.onLabelChange}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={6} md={12}>
                            <CustomInput name="create-vocabulary.iri" label={i18n("asset.iri")}
                                         value={this.state.iri}
                                         onChange={this.onIriChange} help={i18n("asset.create.iri.help")}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={6} md={12}>
                            <TextArea name="create-vocabulary.comment" label={i18n("vocabulary.comment")}
                                      type="textarea" rows={3} value={this.state.comment} help={i18n("optional")}
                                      onChange={this.onCommentChange}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={6} md={12}>
                            <ButtonToolbar className="pull-right">
                                <Button name="create-vocabulary.submit" onClick={this.onCreate} color="success"
                                        size="sm"
                                        disabled={this.state.label.trim().length === 0}>{i18n("vocabulary.create.submit")}</Button>
                                <Button name="create-vocabulary.cancel" onClick={CreateVocabulary.onCancel}
                                        color="secondary"
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
        onCreate: (vocabulary: Vocabulary) => dispatch(createVocabulary(vocabulary))
    };
})(injectIntl(withI18n(withLoading(CreateVocabulary))));