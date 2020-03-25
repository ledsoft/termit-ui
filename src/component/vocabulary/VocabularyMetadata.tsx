import * as React from "react";
import {FormattedDate, FormattedTime, injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import Vocabulary from "../../model/Vocabulary";
import {Col, Label, Row} from "reactstrap";
import UnmappedProperties from "../genericmetadata/UnmappedProperties";
import DocumentFiles from "../resource/document/DocumentFiles";
import ImportedVocabulariesList from "./ImportedVocabulariesList";
import ResourceLink from "../resource/ResourceLink";
import Tabs from "../misc/Tabs";
import AssetHistory from "../changetracking/AssetHistory";

interface VocabularyMetadataProps extends HasI18n {
    vocabulary: Vocabulary;
    onFileAdded: () => void;
}

interface VocabularyMetadataState {
    activeTab: string;
}

export class VocabularyMetadata extends React.Component<VocabularyMetadataProps, VocabularyMetadataState> {
    constructor(props: VocabularyMetadataProps) {
        super(props);
        this.state = {
            activeTab: props.vocabulary.document ? "vocabulary.detail.files" : "properties.edit.title"
        };
    }

    public componentDidUpdate(prevProps: Readonly<VocabularyMetadataProps>): void {
        if (prevProps.vocabulary !== this.props.vocabulary) {
            this.setState({activeTab: this.props.vocabulary.document ? "vocabulary.detail.files" : "properties.edit.title"});
        }
    }

    private onTabSelect = (tabId: string) => {
        this.setState({activeTab: tabId});
    };

    public render() {
        const i18n = this.props.i18n;
        const vocabulary = this.props.vocabulary;
        return <div className="metadata-panel">
            <Row>
                <Col xl={2} md={4}>
                    <Label className="attribute-label">{i18n("asset.author")}</Label>
                </Col>
                <Col xl={10} md={8}>
                    <Label id="vocabulary-metadata-author">{vocabulary.author && vocabulary.author.fullName}</Label>
                </Col>
            </Row>
            <Row>
                <Col xl={2} md={4}>
                    <Label className="attribute-label">{i18n("asset.created")}</Label>
                </Col>
                <Col xl={10} md={8}>
                    <Label
                        id="vocabulary-metadata-created">
                        <FormattedDate value={new Date(vocabulary.created as number)}/>
                        {", "}
                        <FormattedTime value={new Date(vocabulary.created as number)}/></Label>
                </Col>
            </Row>
            <Row>
                <Col xl={2} md={4}>
                    <Label className="attribute-label">{i18n("vocabulary.comment")}</Label>
                </Col>
                <Col xl={10} md={8}>
                    <Label id="vocabulary-metadata-comment">{vocabulary.comment}</Label>
                </Col>
            </Row>
            <ImportedVocabulariesList vocabularies={vocabulary.importedVocabularies}/>
            {this.renderVocabularyDocument()}
            <Row>
                <Col xs={12}>
                    {this.renderTabs()}
                </Col>
            </Row>
        </div>;
    }

    private renderVocabularyDocument() {
        const document = this.props.vocabulary.document;
        if (!document) {
            return null;
        } else {
            return <Row>
                <Col xl={2} md={4}>
                    <Label className="attribute-label">{this.props.i18n("vocabulary.detail.document")}</Label>
                </Col>
                <Col xl={10} md={8}>
                    <ResourceLink id="vocabulary-metadata-document" resource={document}/>
                </Col>
            </Row>
        }
    }

    private renderTabs() {
        const vocabulary = this.props.vocabulary;
        const tabs = {};
        // Ensure order of tabs (Files) | Unmapped properties | History
        if (vocabulary.document) {
            tabs["vocabulary.detail.files"] =
                <DocumentFiles document={vocabulary.document} onFileAdded={this.props.onFileAdded}/>;
        }
        tabs["properties.edit.title"] = <UnmappedProperties properties={vocabulary.unmappedProperties}
                                                            showInfoOnEmpty={true}/>;
        tabs["history.label"] = <AssetHistory asset={vocabulary}/>;

        return <Tabs activeTabLabelKey={this.state.activeTab} changeTab={this.onTabSelect} tabs={tabs} tabBadges={{
            "properties.edit.title": vocabulary.unmappedProperties.size.toFixed(),
        }}/>;
    }
}

export default injectIntl(withI18n(VocabularyMetadata));
