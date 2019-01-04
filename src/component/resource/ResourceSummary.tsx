import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {RouteComponentProps} from "react-router";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {loadResource, loadResourceTerms, updateResourceTerms} from "../../action/AsyncActions";
import {Button, ButtonToolbar} from "reactstrap";
import PanelWithActions from "../misc/PanelWithActions";
import {default as VocabularyUtils, IRI} from "../../util/VocabularyUtils";
import {GoPencil} from "react-icons/go";
import {ThunkDispatch} from "../../util/Types";
import EditableComponent from "../misc/EditableComponent";
import Utils from "../../util/Utils";
import {default as Resource, EMPTY_RESOURCE} from "../../model/Resource";
import ResourceMetadata from "./ResourceMetadata";
import ResourceEdit from "./ResourceEdit";
import "./Resources.scss";

interface ResourceSummaryProps extends HasI18n, RouteComponentProps<any> {
    resource: Resource;
    loadResource: (iri: IRI) => Promise<any>;
    loadResourceTerms: (iri: IRI) => Promise<any>;
    saveResource: (resource: Resource) => Promise<any>;
}

export class ResourceSummary extends EditableComponent<ResourceSummaryProps> {

    constructor(props: ResourceSummaryProps) {
        super(props);
        this.state = {
            edit: false
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
            if (iri.fragment !== normalizedName || iri.namespace !== namespace) {
                this.forceReload();
            }
        }
    }

    public onSave = (resource: Resource) => {
        this.props.saveResource(resource).then(() => this.onCloseEdit()).then(() => this.forceReload());
    };

    private forceReload() {
        const namespace = Utils.extractQueryParam(this.props.location.search, "namespace");
        const normalizedName = this.props.match.params.name;
        this.props.loadResource({fragment: normalizedName, namespace}).then(() =>
        this.props.loadResourceTerms({fragment: normalizedName, namespace}));
    }

    public render() {
        const buttons = [];
        if (!this.state.edit) {
            buttons.push(<Button key="resource.summary.edit" size="sm" color="primary" title={this.props.i18n("edit")}
                                 onClick={this.onEdit}><GoPencil/></Button>);
        }
        const actions = [<ButtonToolbar key="resource.summary.actions">{buttons}</ButtonToolbar>];

        const component = this.state.edit ?
            <ResourceEdit
                resource={this.props.resource}
                save={this.onSave}
                cancel={this.onCloseEdit}/> :
            <ResourceMetadata resource={this.props.resource}/>;
        return <PanelWithActions
                title={this.props.resource.label}
                actions={actions}>
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
        loadResourceTerms: (iri: IRI) => dispatch(loadResourceTerms(iri)),
        saveResource: (resource: Resource) => dispatch(updateResourceTerms(resource))
    };
})(injectIntl(withI18n(ResourceSummary)));