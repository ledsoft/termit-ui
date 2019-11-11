import {
    CreateVocabularyMetadata,
    CreateVocabularyMetadataProps,
    CreateVocabularyMetadataState
} from "./CreateVocabularyMetadata";
import {Button, Col, Input, InputGroup, InputGroupAddon, Label, Row} from "reactstrap";
import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n from "../hoc/withI18n";
import CreateDocumentForVocabulary from "./CreateDocumentForVocabulary";
import {GoPlus} from "react-icons/go";
import Vocabulary from "../../model/Vocabulary";
import Resource from "../../model/Resource";
import Document from "../../model/Document";

interface CreateDocumentVocabularyMetadataProps extends CreateVocabularyMetadataProps {

}

interface CreateDocumentVocabularyMetadataState extends CreateVocabularyMetadataState {
     resource?: Resource | null;
    showCreateDocument: boolean;
}

export class CreateDocumentVocabularyMetadata extends CreateVocabularyMetadata<CreateDocumentVocabularyMetadataProps, CreateDocumentVocabularyMetadataState> {

    constructor(props: CreateDocumentVocabularyMetadataProps) {
        super(props);
        this.state = {
            label: "",
            comment: "",
            iri: "",
            generateIri: true,
            resource: null,
            showCreateDocument: false
        }
    }

    public createDocument = () => {
        this.setState({showCreateDocument: true});

    };

    public onDocumentSet(doc: Resource) {
        this.setState({resource: doc, showCreateDocument: false});
    }

    public closeCreateDocument = () => {
        this.setState({showCreateDocument: false});
    };

    public onCreate = (): void => {
        if (this.state.resource) {
        this.props.onCreate(new Vocabulary({
            label: this.state.label,
            iri: this.state.iri,
            comment: this.state.comment,
            document: this.state.resource as Document
        }))};
    };


    public render() {
        const i18n = this.props.i18n;
        const onDocumentSet = this.onDocumentSet.bind(this);
        const disabled = !(this.state.label.length > 0);
        return <>
                {this.renderVocabularyMetadata()}
                <CreateDocumentForVocabulary showCreateDocument={this.state.showCreateDocument}
                                             resource={this.state.resource} onCancel={this.closeCreateDocument}
                                             onDocumentSet={onDocumentSet} iri={this.state.iri}/>

                <Row>
                    <Col xl={6} md={12}>
                    <Label className="attribute-label">{i18n("vocabulary.detail.document")}</Label>
                    <InputGroup className="form-group">
                        <Input name="create-document-label" disabled={true} value={this.state.resource ? this.state.resource.label : undefined}/>
                        <InputGroupAddon addonType="append">
                            <Button id="create-document-for-vocabulary" color="primary" size="sm"
                                    className="term-edit-source-add-button" disabled={disabled}
                                    onClick={this.createDocument}><GoPlus/>&nbsp;{i18n("resource.document.vocabulary.create")}</Button>
                        </InputGroupAddon>
                    </InputGroup>
                    </Col>
                </Row>
                {this.renderSubmitButtons(this.state.resource)}
            </>
    }
}
export default (injectIntl(withI18n(CreateDocumentVocabularyMetadata)));