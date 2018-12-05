import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Route, RouteComponentProps, Switch} from "react-router";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import VocabularyUtils, {IRI} from "../../util/VocabularyUtils";
import {ThunkDispatch} from "../../util/Types";
import EditableComponent from "../misc/EditableComponent";
import Utils from "../../util/Utils";
import Resource, {EMPTY_RESOURCE} from "../../model/Resource";
import ResourceMetadata from "./ResourceMetadata";
import {loadResource, loadResourceTerms} from "../../action/AsyncActions";
import Term from "../../model/Term";
import Routes from "../../util/Routes";
import Col from "reactstrap/lib/Col";
import {Row} from "reactstrap";
import OutgoingLink from "../misc/OutgoingLink";
import Resources from "./Resources";

interface ResourceDetailProps extends HasI18n, RouteComponentProps<any> {
    resource: Resource;
    resourceTerms: Term[];
    loadResource: (iri: IRI) => void;
    loadResourceTerms: (iri: IRI) => void;
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


    public render() {
        // const buttons = [];
        // if (!this.state.edit) {
        //     buttons.push(<Button key='vocabulary.summary.edit' size='sm' color='info'><GoPencil/></Button>);
        // }
        // const actions = [<ButtonToolbar key='resource.detail.actions'>{buttons}</ButtonToolbar>];
        const label = this.props.resource.label;

        return <div>
            <h2 className='page-header'>
                <OutgoingLink
                    label={label}
                    iri={this.props.resource.iri as string}
                />
            </h2>
            <Row className='detail-row'>
                <Col md={4}>
                    <Resources/>
                </Col>
                <Col md={8}>
                    <Switch>
                        <Route path={Routes.resourceSummary.path} component={ResourceMetadata} exact={true}/>
                    </Switch>
                </Col>
            </Row>
        </div>;
    }
}

export default connect((state: TermItState) => {
    return {
        resource: state.resource
    };
}, (dispatch: ThunkDispatch) => {
    return {
        loadResource: (iri: IRI) => dispatch(loadResource(iri)),
        loadResourceTerms: (iri: IRI) => dispatch(loadResourceTerms(iri))
    };
})(injectIntl(withI18n(ResourceDetail)));