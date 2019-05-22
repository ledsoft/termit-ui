import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n from "../hoc/withI18n";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {
    executeFileTextAnalysis,
    exportFileContent,
    hasFileContent,
    loadResource,
    removeResource,
    updateResourceTerms
} from "../../action/AsyncActions";
import {
    Button,
    ButtonToolbar,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    UncontrolledButtonDropdown
} from "reactstrap";
import PanelWithActions from "../misc/PanelWithActions";
import {default as VocabularyUtils, IRI} from "../../util/VocabularyUtils";
import {GoClippy, GoFile} from "react-icons/go";
import {ThunkDispatch} from "../../util/Types";
import {default as Resource} from "../../model/Resource";
import "./Resources.scss";
import {consumeNotification, publishNotification} from "../../action/SyncActions";
import RemoveAssetDialog from "../asset/RemoveAssetDialog";
import File from "../../model/File";
import ResourceSelectVocabulary from "./ResourceSelectVocabulary";
import Vocabulary from "../../model/Vocabulary";
import Routes from "../../util/Routes";
import AppNotification from "../../model/AppNotification";
import NotificationType from "../../model/NotificationType";
import Routing from "../../util/Routing";
import {ResourceSummary, ResourceSummaryProps, ResourceSummaryState} from "./ResourceSummary";

interface FileSummaryProps extends ResourceSummaryProps {
    resource: File;
    notifications: AppNotification[];
    consumeNotification: (notification: AppNotification) => void;
    publishNotification: (notification: AppNotification) => void;

    executeFileTextAnalysis: (file: File, vocabularyIri?: string) => Promise<any>;
    hasContent: (iri: IRI) => Promise<boolean>;
    downloadContent: (iri: IRI) => void;
}

interface FileSummaryState extends ResourceSummaryState {
    showSelectVocabulary: boolean;
    hasContent: boolean;
}

export class FileSummary extends ResourceSummary<FileSummaryProps, FileSummaryState> {

    constructor(props: FileSummaryProps) {
        super(props);
        this.state = {
            edit: false,
            showRemoveDialog: false,
            showSelectVocabulary: false,
            hasContent: false
        };
    }

    public componentDidMount(): void {
        this.checkForContent(VocabularyUtils.create(this.props.resource.iri));
    }

    public componentDidUpdate(prevProps: FileSummaryProps): void {
        const resourceIri = VocabularyUtils.create(this.props.resource.iri);
        if (this.props.resource.iri !== prevProps.resource.iri) {
            this.checkForContent(resourceIri);
        }
        const fileUploadNotification = this.props.notifications.find(n => n.source.type === NotificationType.FILE_CONTENT_UPLOADED);
        if (fileUploadNotification) {
            this.checkForContent(resourceIri);
            this.props.consumeNotification(fileUploadNotification);
        }
    }

    private checkForContent(iri: IRI) {
        this.props.hasContent(iri).then((res: boolean) => this.setState({hasContent: res}));
    }

    public onVocabularySet = (voc: Vocabulary) => {
        const file = this.props.resource;
        this.props.executeFileTextAnalysis(file, voc.iri).then(() => this.props.publishNotification({source: {type: NotificationType.TEXT_ANALYSIS_FINISHED}}));
        this.setState({showSelectVocabulary: false})
    };

    private onSelectVocabularyCancel = () => {
        this.setState({showSelectVocabulary: false})
    };

    public onAnalyze = () => {
        const file = this.props.resource;
        if (file.owner && file.owner.vocabulary) {
            this.props.executeFileTextAnalysis(file).then(() => this.props.publishNotification({source: {type: NotificationType.TEXT_ANALYSIS_FINISHED}}));
        } else {
            this.setState({showSelectVocabulary: true});
        }
    };

    private onViewContent = () => {
        const iri = VocabularyUtils.create(this.props.resource.iri);
        Routing.transitionTo(Routes.annotateFile, {
            params: new Map([["name", iri.fragment]]),
            query: new Map([["namespace", iri.namespace!]])
        });
    };

    public onDownloadContent = () => {
        const iri = VocabularyUtils.create(this.props.resource.iri);
        this.props.downloadContent(iri);
    };

    public render() {
        let buttons = this.createContentRelatedButtons();
        buttons = buttons.concat(this.getActionButtons());
        const actions = [<ButtonToolbar key="resource.summary.actions">{buttons}</ButtonToolbar>];

        return <PanelWithActions id="resource-detail"
                                 title={this.props.resource.label}
                                 actions={actions}>
            <RemoveAssetDialog show={this.state.showRemoveDialog} asset={this.props.resource}
                               onCancel={this.onRemoveCancel} onSubmit={this.onRemove}/>
            <ResourceSelectVocabulary show={this.state.showSelectVocabulary} asset={this.props.resource}
                                      onCancel={this.onSelectVocabularyCancel} onSubmit={this.onVocabularySet}/>
            {this.state.edit ? this.renderMetadataEdit() : this.renderMetadata()}
        </PanelWithActions>;
    }

    private createContentRelatedButtons() {
        if (this.state.hasContent) {
            const i18n = this.props.i18n;
            return [<UncontrolledButtonDropdown id="resource-detail-content" key="resource-detail-content" size="sm">
                <DropdownToggle caret={true} color="primary"><GoFile/>&nbsp;{i18n("resource.metadata.file.content")}
                </DropdownToggle>
                <DropdownMenu className="glossary-export-menu">
                    <DropdownItem id="resource-detail-content-view" className="btn-sm" onClick={this.onViewContent}
                                  title={i18n("resource.metadata.file.content.view.tooltip")}>
                        {i18n("resource.metadata.file.content.view")}
                    </DropdownItem>
                    <DropdownItem id="resource-detail-content-download" className="btn-sm"
                                  onClick={this.onDownloadContent}>
                        {i18n("resource.metadata.file.content.download")}
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledButtonDropdown>,
                <Button id="resource-file-analyze" key="resource.file.analyze" size="sm" color="primary"
                        title={i18n("file.metadata.startTextAnalysis.text")}
                        onClick={this.onAnalyze}><GoClippy/>&nbsp;{i18n("file.metadata.startTextAnalysis.text")}
                </Button>
            ];
        }
        return [];
    }
}

export default connect((state: TermItState) => {
    return {
        notifications: state.notifications
    };
}, (dispatch: ThunkDispatch) => {
    return {
        loadResource: (iri: IRI) => dispatch(loadResource(iri)),
        saveResource: (resource: Resource) => dispatch(updateResourceTerms(resource)),
        removeResource: (resource: Resource) => dispatch(removeResource(resource)),
        consumeNotification: (notification: AppNotification) => dispatch(consumeNotification(notification)),
        publishNotification: (notification: AppNotification) => dispatch(publishNotification(notification)),
        executeFileTextAnalysis: (file: File, vocabularyIri: string) => dispatch(executeFileTextAnalysis(file, vocabularyIri)),
        hasContent: (iri: IRI) => dispatch(hasFileContent(iri)),
        downloadContent: (iri: IRI) => dispatch(exportFileContent(iri))
    };
})(injectIntl(withI18n(FileSummary)));