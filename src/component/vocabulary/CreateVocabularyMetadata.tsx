import withI18n, {HasI18n} from "../hoc/withI18n";
import Vocabulary from "../../model/Vocabulary";
import {AbstractCreateAsset, AbstractCreateAssetState} from "../asset/AbstractCreateAsset";
import Constants from "../../util/Constants";
import * as React from "react";
import {Button, ButtonToolbar, Col, Row} from "reactstrap";
import CustomInput from "../misc/CustomInput";
import TextArea from "../misc/TextArea";
import {injectIntl} from "react-intl";

export interface CreateVocabularyMetadataProps extends HasI18n {
    onCreate: (vocabulary: Vocabulary) => void;
    onCancel: () => void;
}

export interface CreateVocabularyMetadataState extends AbstractCreateAssetState {
    comment: string;
}

export class CreateVocabularyMetadata<P extends CreateVocabularyMetadataProps = CreateVocabularyMetadataProps, S extends CreateVocabularyMetadataState = CreateVocabularyMetadataState>
extends AbstractCreateAsset<P, S> {

    constructor(props: P) {
        super(props);
        this.state = {
            label: "",
            comment: "",
            iri: "",
            generateIri: true
        } as S;
    }

    protected get identifierGenerationEndpoint(): string {
        return Constants.API_PREFIX + "/vocabularies/identifier";
    }

    private onCommentChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({comment: e.currentTarget.value});
    };

    public onCreate = () => {
        this.props.onCreate(new Vocabulary({
            label: this.state.label,
            iri: this.state.iri,
            comment: this.state.comment
        }));
    };

    public render() {
        return <>
                    {this.renderVocabularyMetadata()}
                    {this.renderSubmitButtons()}
                    </>
    }

    protected renderVocabularyMetadata() {
        const i18n = this.props.i18n;
        return <>
            <Row>
                <Col xl={6} md={12}>
                    <CustomInput name="create-vocabulary-label" label={i18n("asset.label")}
                                 value={this.state.label}
                                 onChange={this.onLabelChange}/>
                </Col>
            </Row>
            <Row>
                <Col xl={6} md={12}>
                    <CustomInput name="create-vocabulary-iri" label={i18n("asset.iri")}
                                 value={this.state.iri}
                                 onChange={this.onIriChange} help={i18n("asset.create.iri.help")}/>
                </Col>
            </Row>
            <Row>
                <Col xl={6} md={12}>
                    <TextArea name="create-vocabulary-comment" label={i18n("vocabulary.comment")}
                              type="textarea" rows={3} value={this.state.comment} help={i18n("optional")}
                              onChange={this.onCommentChange}/>
                </Col>
            </Row>
        </>
    }

    protected renderSubmitButtons() {
        const i18n =this.props.i18n
        return <>
            <Row>
                <Col xl={6} md={12}>
                    <ButtonToolbar className="pull-right">
                        <Button id="create-vocabulary-submit" onClick={this.onCreate} color="success"
                                size="sm"
                                disabled={this.state.label.trim().length === 0}>{i18n("vocabulary.create.submit")}</Button>
                        <Button id="create-vocabulary-cancel" onClick={this.props.onCancel}
                                color="secondary"
                                size="sm">{i18n("cancel")}</Button>
                    </ButtonToolbar>
                </Col>
            </Row>
        </>
    }
}

export default injectIntl(withI18n(CreateVocabularyMetadata));