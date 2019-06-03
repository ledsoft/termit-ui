import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n from "../hoc/withI18n";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {
    exportFileContent,
    hasFileContent,
    loadResource,
    removeResource,
    updateResourceTerms
} from "../../action/AsyncActions";
import {ButtonToolbar, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledButtonDropdown} from "reactstrap";
import PanelWithActions from "../misc/PanelWithActions";
import {default as VocabularyUtils, IRI} from "../../util/VocabularyUtils";
import {GoFile} from "react-icons/go";
import {ThunkDispatch} from "../../util/Types";
import {default as Resource} from "../../model/Resource";
import "./Resources.scss";
import {consumeNotification} from "../../action/SyncActions";
import RemoveAssetDialog from "../asset/RemoveAssetDialog";
import File from "../../model/File";
import Routes from "../../util/Routes";
import AppNotification from "../../model/AppNotification";
import NotificationType from "../../model/NotificationType";
import Routing from "../../util/Routing";
import {ResourceSummary, ResourceSummaryProps, ResourceSummaryState} from "./ResourceSummary";
import TextAnalysisInvocationButton from "./file/TextAnalysisInvocationButton";

interface FileSummaryProps extends ResourceSummaryProps {
    resource: File;
    notifications: AppNotification[];
    consumeNotification: (notification: AppNotification) => void;

    hasContent: (iri: IRI) => Promise<boolean>;
    downloadContent: (iri: IRI) => void;
}

interface FileSummaryState extends ResourceSummaryState {
    hasContent: boolean;
}

export class FileSummary extends ResourceSummary<FileSummaryProps, FileSummaryState> {

    constructor(props: FileSummaryProps) {
        super(props);
        this.state = {
            edit: false,
            showRemoveDialog: false,
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
                <TextAnalysisInvocationButton id="resource-file-analyze" key="resource-file-analyze"
                                              file={this.props.resource}/>
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
        hasContent: (iri: IRI) => dispatch(hasFileContent(iri)),
        downloadContent: (iri: IRI) => dispatch(exportFileContent(iri))
    };
})(injectIntl(withI18n(FileSummary)));