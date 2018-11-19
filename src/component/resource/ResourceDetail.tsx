import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {RouteComponentProps} from "react-router";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import PanelWithActions from "../misc/PanelWithActions";
import VocabularyUtils, {IRI} from "../../util/VocabularyUtils";
import {ThunkDispatch} from "../../util/Types";
import EditableComponent from "../misc/EditableComponent";
import Utils from "../../util/Utils";
import Resource from "../../model/Resource";
import ResourceMetadata from "./ResourceMetadata";
import {loadResource} from "../../action/AsyncActions";

interface ResourceDetailProps extends HasI18n, RouteComponentProps<any> {
    resource: Resource;
    loadResource: (iri: IRI) => void;
    updateResource: (resource: Resource) => Promise<any>;
}

export class ResourceDetail extends EditableComponent<ResourceDetailProps> {

    constructor(props: ResourceDetailProps) {
        super(props);
        this.state = {
            edit: false
        };
    }

    public componentDidMount(): void {
        this.loadResource();
    }

    public componentDidUpdate(): void {
        this.loadResource();
    }

    private loadResource(): void {
        const normalizedName = this.props.match.params.name;
        const namespace = Utils.extractQueryParam(this.props.location.search, 'namespace');
        const iri = VocabularyUtils.create(this.props.resource.iri);
        if (iri.fragment !== normalizedName || iri.namespace !== namespace) {
            this.props.loadResource({fragment: normalizedName, namespace});
        }
    }


    public render() {
        // const buttons = [];
        // if (!this.state.edit) {
        //     buttons.push(<Button key='vocabulary.summary.edit' size='sm' color='info'><GoPencil/></Button>);
        // }
        // const actions = [<ButtonToolbar key='resource.detail.actions'>{buttons}</ButtonToolbar>];
        const component = <ResourceMetadata resource={this.props.resource}/>;
        return <div>
            <PanelWithActions
                title={this.props.resource.label}
                actions={[]}
                component={component}/>
        </div>;
    }
}

export default connect((state: TermItState) => {
    return {
        resource: state.resource
    };
}, (dispatch: ThunkDispatch) => {
    return {
        loadResource: (iri: IRI) => dispatch(loadResource(iri))
    };
})(injectIntl(withI18n(ResourceDetail)));