import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {RouteComponentProps} from "react-router";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {loadResource, loadResourceTerms, updateResource} from "../../action/AsyncActions";
import {Button, ButtonToolbar} from "reactstrap";
import PanelWithActions from "../misc/PanelWithActions";
import VocabularyUtils, {IRI} from "../../util/VocabularyUtils";
import {GoPencil} from 'react-icons/go';
import {ThunkDispatch} from "../../util/Types";
import EditableComponent from "../misc/EditableComponent";
import Utils from "../../util/Utils";
import {EMPTY_RESOURCE, default as Resource} from "../../model/Resource";
import ResourceMetadata from "./ResourceMetadata";
import ResourceEdit from "./ResourceEdit";
import Term from "../../model/Term";

interface ResourceSummaryProps extends HasI18n, RouteComponentProps<any> {
    resource: Resource;
    terms: Term[],
    loadResource: (iri: IRI) => void;
    loadResourceTerms: (iri: IRI) => void;
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
        this.loadResource();
    }

    public componentDidUpdate(): void {
        if (this.props.resource !== EMPTY_RESOURCE) {
            this.loadResource();
        }
    }

    private loadResource(): void {
        const normalizedName = this.props.match.params.name;
        const namespace = Utils.extractQueryParam(this.props.location.search, 'namespace');
        const iri = VocabularyUtils.create(this.props.resource.iri);
        if (iri.fragment !== normalizedName || iri.namespace !== namespace) {
            this.props.loadResource({fragment: normalizedName, namespace});
            this.props.loadResourceTerms({fragment: normalizedName, namespace});
        }
    }

    public onSave = (resource: Resource) => {
        this.props.saveResource(resource).then(() => {
            this.onCloseEdit();
            this.props.loadResource(VocabularyUtils.create(resource.iri));
        });
    };

    public render() {
        const buttons = [];
        if (!this.state.edit) {
            buttons.push(<Button key='resource.summary.edit' size='sm' color='info' title={this.props.i18n('edit')}
                                 onClick={this.onEdit}><GoPencil/></Button>);
        }
        const actions = [<ButtonToolbar key='resource.summary.actions'>{buttons}</ButtonToolbar>];

        const component = this.state.edit ?
            <ResourceEdit
                resource={this.props.resource}
                save={this.onSave}
                cancel={this.onCloseEdit}/> :
            <ResourceMetadata resource={this.props.resource}/>;
        return <div>
            <PanelWithActions
                title={this.props.resource.label}
                actions={actions}
                component={component}/>
        </div>;
    }
}

export default connect((state: TermItState) => {
    return {
        resource: state.resource,
        terms : state.defaultTerms
    };
}, (dispatch: ThunkDispatch) => {
    return {
        loadResource: (iri: IRI) => dispatch(loadResource(iri)),
        loadResourceTerms: (iri: IRI) => dispatch(loadResourceTerms(iri)),
        saveResource: (resource: Resource) => dispatch(updateResource(resource))
    };
})(injectIntl(withI18n(ResourceSummary)));