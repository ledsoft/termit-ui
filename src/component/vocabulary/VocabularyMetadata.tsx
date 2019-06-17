import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import Vocabulary from "../../model/Vocabulary";
import {Col, Label, Row} from "reactstrap";
import UnmappedProperties from "../genericmetadata/UnmappedProperties";
import DocumentFiles from "../resource/document/DocumentFiles";
import ImportedVocabulariesList from "./ImportedVocabulariesList";
import ResourceLink from "../resource/ResourceLink";

interface VocabularyMetadataProps extends HasI18n {
    vocabulary: Vocabulary;
    onFileAdded: () => void;
}

export class VocabularyMetadata extends React.Component<VocabularyMetadataProps> {
    constructor(props: VocabularyMetadataProps) {
        super(props);
    }

    public render() {
        const i18n = this.props.i18n;
        const vocabulary = this.props.vocabulary;
        return <div className="metadata-panel">
            <Row>
                <Col md={2}>
                    <Label className="attribute-label">{i18n("asset.author")}</Label>
                </Col>
                <Col md={10}>
                    <Label id="vocabulary-metadata-author">{vocabulary.author && vocabulary.author.fullName}</Label>
                </Col>
            </Row>
            <Row>
                <Col md={2}>
                    <Label className="attribute-label">{i18n("asset.created")}</Label>
                </Col>
                <Col md={10}>
                    <Label
                        id="vocabulary-metadata-created">{vocabulary.created && new Date(vocabulary.created).toLocaleString()}</Label>
                </Col>
            </Row>
            <Row>
                <Col md={2}>
                    <Label className="attribute-label">{i18n("vocabulary.comment")}</Label>
                </Col>
                <Col md={10}>
                    <Label id="vocabulary-metadata-comment">{vocabulary.comment}</Label>
                </Col>
            </Row>
            <ImportedVocabulariesList vocabularies={vocabulary.importedVocabularies}/>
            {this.renderVocabularyDocument()}
            <Row className="mt-3">
                <Col xs={12}>
                    <UnmappedProperties properties={vocabulary.unmappedProperties}/>
                </Col>
            </Row>
            {vocabulary.document &&
            <DocumentFiles document={vocabulary.document} onFileAdded={this.props.onFileAdded}/>}
        </div>;
    }

    private renderVocabularyDocument() {
        const document = this.props.vocabulary.document;
        if (!document) {
            return null;
        } else {
            return <Row>
                <Col md={2}>
                    <Label className="attribute-label">{this.props.i18n("vocabulary.detail.document")}</Label>
                </Col>
                <Col md={10}>
                    <ResourceLink id="vocabulary-metadata-document" resource={document}/>
                </Col>
            </Row>
        }
    }
}

export default injectIntl(withI18n(VocabularyMetadata));