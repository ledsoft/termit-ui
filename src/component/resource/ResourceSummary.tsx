import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {loadResource, removeResource, updateResource} from "../../action/AsyncActions";
import {Button, ButtonToolbar} from "reactstrap";
import PanelWithActions from "../misc/PanelWithActions";
import {default as VocabularyUtils, IRI} from "../../util/VocabularyUtils";
import {GoPencil, GoX} from "react-icons/go";
import {ThunkDispatch} from "../../util/Types";
import EditableComponent, {EditableComponentState} from "../misc/EditableComponent";
import Resource from "../../model/Resource";
import ResourceMetadata from "./ResourceMetadata";
import ResourceEdit from "./ResourceEdit";
import "./Resources.scss";
import RemoveAssetDialog from "../asset/RemoveAssetDialog";
import ResourceTermAssignments from "./ResourceTermAssignments";

export interface ResourceSummaryProps extends HasI18n {
    resource: Resource;
    loadResource: (iri: IRI) => Promise<any>;
    saveResource: (resource: Resource) => Promise<any>;
    removeResource: (resource: Resource) => Promise<any>;
}

export interface ResourceSummaryState extends EditableComponentState {
    showRemoveDialog: boolean;
}

export class ResourceSummary<P extends ResourceSummaryProps = ResourceSummaryProps, S extends ResourceSummaryState = ResourceSummaryState>
    extends EditableComponent<P, S> {

    constructor(props: P) {
        super(props);
        this.state = {
            edit: false,
            showRemoveDialog: false
        } as S;
    }

    public onSave = (resource: Resource) => {
        this.props.saveResource(resource).then(() => {
            this.onCloseEdit();
            return this.props.loadResource(VocabularyUtils.create(this.props.resource.iri));
        });
    };

    protected onRemoveClick = () => {
        this.setState({showRemoveDialog: true});
    };

    public onRemove = () => {
        this.props.removeResource(this.props.resource);
        this.setState({showRemoveDialog: false});
    };

    protected onRemoveCancel = () => {
        this.setState({showRemoveDialog: false});
    };

    protected canRemove() {
        return true;
    }

    public render() {
        const actions = [<ButtonToolbar key="resource.summary.actions">{this.getActionButtons()}</ButtonToolbar>];

        return <PanelWithActions id="resource-detail"
                                 title={this.props.resource.label}
                                 actions={actions}>
            <RemoveAssetDialog show={this.state.showRemoveDialog} asset={this.props.resource}
                               onCancel={this.onRemoveCancel} onSubmit={this.onRemove}/>
            {this.state.edit ? this.renderMetadataEdit() : this.renderMetadata()}
        </PanelWithActions>;
    }

    protected getActionButtons() {
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
        return buttons;
    }

    protected renderMetadataEdit() {
        return <ResourceEdit resource={this.props.resource} save={this.onSave} cancel={this.onCloseEdit}/>;
    }

    protected renderMetadata() {
        return <div className="metadata-panel">
            <ResourceMetadata resource={this.props.resource}/>
            <ResourceTermAssignments resource={this.props.resource}/>
        </div>;
    }
}

export default connect((state: TermItState) => {
    return {
        intl: state.intl
    };
}, (dispatch: ThunkDispatch) => {
    return {
        loadResource: (iri: IRI) => dispatch(loadResource(iri)),
        saveResource: (resource: Resource) => dispatch(updateResource(resource)),
        removeResource: (resource: Resource) => dispatch(removeResource(resource))
    };
})(injectIntl(withI18n(ResourceSummary)));