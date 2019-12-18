import * as React from "react";
import {injectIntl} from "react-intl";
import {Button, ButtonGroup, Card, CardBody, CardHeader, Col, Label, Row} from "reactstrap";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {connect} from "react-redux";
import Routes from "../../util/Routes";
import Routing from "../../util/Routing";
import withLoading from "../hoc/withLoading";
import {createVocabulary} from "../../action/AsyncActions";
import Vocabulary from "../../model/Vocabulary";
import {ThunkDispatch} from "../../util/Types";
import VocabularyUtils from "../../util/VocabularyUtils";
import CreateVocabularyMetadata from "./CreateVocabularyMetadata";
import CreateDocumentVocabularyMetadata from "./CreateDocumentVocabularyMetadata";

interface CreateVocabularyProps extends HasI18n {
    onCreate: (vocabulary: Vocabulary) => void
}

interface CreateVocabularyState {
    type: string;
}

export class CreateVocabulary extends React.Component<CreateVocabularyProps, CreateVocabularyState> {

    constructor(props: CreateVocabularyProps) {
        super(props);
        this.state = {
            type: VocabularyUtils.VOCABULARY
        };
    }

    private onTypeSelect = (type: string) => {
        this.setState({type});
    };

    public onCreate = (vocabulary : Vocabulary): void => {
        vocabulary.addType(this.state.type);
        return this.props.onCreate(vocabulary);
    };

    public static onCancel(): void {
        Routing.transitionTo(Routes.vocabularies);
    }

    public render() {
        const i18n = this.props.i18n;
        return <Card id="create-vocabulary">
            <CardHeader color="info">
                <h5>{i18n("vocabulary.create.title")}</h5>
            </CardHeader>
            <CardBody>
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
                                    <Button id="create-resource-type-document" color="info" size="sm"
                                            className="w-100 create-resource-type-select" outline={true}
                                            onClick={this.onTypeSelect.bind(null, VocabularyUtils.VOCABULARY)}
                                            active={this.state.type === VocabularyUtils.VOCABULARY}>{i18n("type.vocabulary")}</Button>
                                    <Button id="create-resource-type-file" color="info" size="sm"
                                            className="w-100 create-resource-type-select" outline={true}
                                            onClick={this.onTypeSelect.bind(null, VocabularyUtils.DOCUMENT_VOCABULARY)}
                                            active={this.state.type === VocabularyUtils.DOCUMENT_VOCABULARY}>{i18n("type.document.vocabulary")}</Button>
                                </ButtonGroup>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                {this.renderVocabularyMetadataForm()}
            </CardBody>
        </Card>;
    }

    private renderVocabularyMetadataForm() {
        if (this.state.type === VocabularyUtils.DOCUMENT_VOCABULARY) {
            return <CreateDocumentVocabularyMetadata onCreate={this.onCreate} onCancel={CreateVocabulary.onCancel}/>;
        } else {
            return <CreateVocabularyMetadata onCreate={this.onCreate} onCancel={CreateVocabulary.onCancel}/>;
        }
    }

}

export default connect(undefined, (dispatch: ThunkDispatch) => {
    return {
        onCreate: (vocabulary: Vocabulary) => dispatch(createVocabulary(vocabulary))
    };
})(injectIntl(withI18n(withLoading(CreateVocabulary))));