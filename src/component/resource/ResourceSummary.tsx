import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {RouteComponentProps} from "react-router";
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
import {GoClippy, GoFile, GoPencil, GoX} from "react-icons/go";
import {ThunkDispatch} from "../../util/Types";
import EditableComponent, {EditableComponentState} from "../misc/EditableComponent";
import Utils from "../../util/Utils";
import {default as Resource, EMPTY_RESOURCE} from "../../model/Resource";
import Document from "../../model/Document";
import ResourceMetadata from "./ResourceMetadata";
import ResourceEdit from "./ResourceEdit";
import "./Resources.scss";
import {clearResource, consumeNotification, publishNotification} from "../../action/SyncActions";
import RemoveAssetDialog from "../asset/RemoveAssetDialog";
import File from "../../model/File";
import ResourceSelectVocabulary from "./ResourceSelectVocabulary";
import Vocabulary from "../../model/Vocabulary";
import Routes from "../../util/Routes";
import AppNotification from "../../model/AppNotification";
import NotificationType from "../../model/NotificationType";
import Routing from "../../util/Routing";

interface ResourceSummaryProps extends HasI18n, RouteComponentProps<any> {
    resource: Resource;
    notifications: AppNotification[];
    loadResource: (iri: IRI) => Promise<any>;
    saveResource: (resource: Resource) => Promise<any>;
    removeResource: (resource: Resource) => Promise<any>;
    clearResource: () => void;
    consumeNotification: (notification: AppNotification) => void;
    publishNotification: (notification: AppNotification) => void;

    executeFileTextAnalysis: (file: File, vocabularyIri?: string) => Promise<any>;
    hasContent: (iri: IRI) => Promise<boolean>;
    downloadContent: (iri: IRI) => void;
}

interface ResourceSummaryState extends EditableComponentState {
    showRemoveDialog: boolean;
    showSelectVocabulary: boolean;
    vocabulary: Vocabulary | null;
    hasContent: boolean;
}

export class ResourceSummary extends EditableComponent<ResourceSummaryProps, ResourceSummaryState> {

    constructor(props: ResourceSummaryProps) {
        super(props);
        this.state = {
            edit: false,
            showRemoveDialog: false,
            showSelectVocabulary: false,
            vocabulary: null,
            hasContent: false
        };
    }

    public componentDidMount(): void {
        this.forceReload();
    }

    public componentDidUpdate(): void {
        if (this.props.resource !== EMPTY_RESOURCE) {
            const iri = VocabularyUtils.create(this.props.resource.iri);
            const namespace = Utils.extractQueryParam(this.props.location.search, "namespace");
            const normalizedName = this.props.match.params.name;
            if (iri.fragment !== normalizedName || (namespace && iri.namespace !== namespace)) {
                this.forceReload();
            }
            const fileUploadNotification = this.props.notifications.find(n => n.source.type === NotificationType.FILE_CONTENT_UPLOADED);
            if (fileUploadNotification) {
                this.checkForContent(iri);
                this.props.consumeNotification(fileUploadNotification);
            }
        }
    }

    public componentWillUnmount(): void {
        this.props.clearResource();
    }

    public onSave = (resource: Resource) => {
        this.props.saveResource(resource).then(() => this.onCloseEdit()).then(() => this.forceReload());
    };

    private forceReload() {
        const namespace = Utils.extractQueryParam(this.props.location.search, "namespace");
        const normalizedName = this.props.match.params.name;
        const iri = {fragment: normalizedName, namespace};
        this.props.loadResource(iri);
        this.checkForContent(iri);
    }

    private checkForContent(iri: IRI) {
        this.props.hasContent(iri).then((res: boolean) => this.setState({hasContent: res}));
    }

    private onRemoveClick = () => {
        this.setState({showRemoveDialog: true});
    };

    public onRemove = () => {
        this.props.removeResource(this.props.resource);
        this.setState({showRemoveDialog: false});
    };

    private onRemoveCancel = () => {
        this.setState({showRemoveDialog: false});
    };

    private canRemove() {
        const resource = this.props.resource;
        return resource && !(resource as Document).vocabulary && Utils.sanitizeArray((resource as Document).files).length === 0;
    }

    public onVocabularySet = (voc: Vocabulary) => {
        const file = this.props.resource as File;
        this.props.executeFileTextAnalysis(file, voc.iri).then(() => this.props.publishNotification({source: {type: NotificationType.TEXT_ANALYSIS_FINISHED}}));
        this.setState({showSelectVocabulary: false})
    };

    private onSelectVocabularyCancel = () => {
        this.setState({showSelectVocabulary: false})
    };

    public onAnalyze = () => {
        const file = this.props.resource as File;
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
        const i18n = this.props.i18n;
        const buttons = this.createContentRelatedButtons();
        if (!this.state.edit) {
            buttons.push(<Button id="resource-detail-edit" key="resource.summary.edit" size="sm" color="primary"
                                 title={i18n("edit")}
                                 onClick={this.onEdit}><GoPencil/>&nbsp;{i18n("edit")}</Button>);
        }
        if (this.canRemove()) {
            buttons.push(<Button id="resource-detail-remove" key="resource.summary.remove" size="sm" color="secondary"
                                 title={i18n("asset.remove.tooltip")}
                                 onClick={this.onRemoveClick}><GoX/>&nbsp;{i18n("remove")}</Button>);
        }
        const actions = [<ButtonToolbar key="resource.summary.actions">{buttons}</ButtonToolbar>];

        const component = this.state.edit ?
            <ResourceEdit
                resource={this.props.resource}
                save={this.onSave}
                cancel={this.onCloseEdit}/> :
            <ResourceMetadata resource={this.props.resource}/>;
        return <PanelWithActions id="resource-detail"
                                 title={this.props.resource.label}
                                 actions={actions}>
            <RemoveAssetDialog show={this.state.showRemoveDialog} asset={this.props.resource}
                               onCancel={this.onRemoveCancel} onSubmit={this.onRemove}/>
            <ResourceSelectVocabulary show={this.state.showSelectVocabulary} asset={this.props.resource}
                                      onCancel={this.onSelectVocabularyCancel} onSubmit={this.onVocabularySet}/>
            {component}
        </PanelWithActions>;
    }

    private createContentRelatedButtons() {
        if (Utils.getPrimaryAssetType(this.props.resource) === VocabularyUtils.FILE && this.state.hasContent) {
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
        resource: state.resource,
        notifications: state.notifications
    };
}, (dispatch: ThunkDispatch) => {
    return {
        loadResource: (iri: IRI) => dispatch(loadResource(iri)),
        saveResource: (resource: Resource) => dispatch(updateResourceTerms(resource)),
        removeResource: (resource: Resource) => dispatch(removeResource(resource)),
        clearResource: () => dispatch(clearResource()),
        consumeNotification: (notification: AppNotification) => dispatch(consumeNotification(notification)),
        publishNotification: (notification: AppNotification) => dispatch(publishNotification(notification)),
        executeFileTextAnalysis: (file: File, vocabularyIri: string) => dispatch(executeFileTextAnalysis(file, vocabularyIri)),
        hasContent: (iri: IRI) => dispatch(hasFileContent(iri)),
        downloadContent: (iri: IRI) => dispatch(exportFileContent(iri))
    };
})(injectIntl(withI18n(ResourceSummary)));