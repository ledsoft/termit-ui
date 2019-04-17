import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {RouteComponentProps} from "react-router";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {loadResource, removeResource, updateResourceTerms} from "../../action/AsyncActions";
import {Button, ButtonToolbar} from "reactstrap";
import PanelWithActions from "../misc/PanelWithActions";
import {default as VocabularyUtils, IRI} from "../../util/VocabularyUtils";
import {GoPencil, GoX} from "react-icons/go";
import {ThunkDispatch} from "../../util/Types";
import EditableComponent, {EditableComponentState} from "../misc/EditableComponent";
import Utils from "../../util/Utils";
import {default as Resource, EMPTY_RESOURCE} from "../../model/Resource";
import Document from "../../model/Document";
import ResourceMetadata from "./ResourceMetadata";
import ResourceEdit from "./ResourceEdit";
import "./Resources.scss";
import {clearResource} from "../../action/SyncActions";
import RemoveAssetDialog from "../asset/RemoveAssetDialog";

interface ResourceSummaryProps extends HasI18n, RouteComponentProps<any> {
    resource: Resource;
    loadResource: (iri: IRI) => Promise<any>;
    saveResource: (resource: Resource) => Promise<any>;
    removeResource: (resource: Resource) => Promise<any>;
    clearResource: () => void;
}

interface ResourceSummaryState extends EditableComponentState {
    showRemoveDialog: boolean;
}

export class ResourceSummary extends EditableComponent<ResourceSummaryProps, ResourceSummaryState> {

    constructor(props: ResourceSummaryProps) {
        super(props);
        this.state = {
            edit: false,
            showRemoveDialog: false
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
        this.props.loadResource({fragment: normalizedName, namespace});
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

    public render() {
        const i18n = this.props.i18n;
        const buttons = [];
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
            {component}
        </PanelWithActions>;
    }
}

export default connect((state: TermItState) => {
    return {
        resource: state.resource,
    };
}, (dispatch: ThunkDispatch) => {
    return {
        loadResource: (iri: IRI) => dispatch(loadResource(iri)),
        saveResource: (resource: Resource) => dispatch(updateResourceTerms(resource)),
        removeResource: (resource: Resource) => dispatch(removeResource(resource)),
        clearResource: () => dispatch(clearResource())
    };
})(injectIntl(withI18n(ResourceSummary)));