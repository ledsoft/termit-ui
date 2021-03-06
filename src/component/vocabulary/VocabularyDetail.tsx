import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Col, Row} from "reactstrap";
import {Route, RouteComponentProps, Switch} from "react-router";
import Terms from "../term/Terms";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {loadTypes, loadVocabulary} from "../../action/AsyncActions";
import Vocabulary from "../../model/Vocabulary";
import "./VocabularyDetail.scss";
import OutgoingLink from "../misc/OutgoingLink";
import Routes from "../../util/Routes";
import VocabularyUtils, {IRI} from "../../util/VocabularyUtils";
import {ThunkDispatch} from "../../util/Types";
import CreateTerm from "../term/CreateTerm";
import TermDetail from "../term/TermDetail";
import NoTermSelected from "../term/NoTermSelected";
import BreadcrumbRoute from "../breadcrumb/BreadcrumbRoute";
import DynamicBreadcrumbRoute from "../breadcrumb/DynamicBreadcrumbRoute";
import Utils from "../../util/Utils";

interface VocabularyDetailProps extends HasI18n, RouteComponentProps<any> {
    vocabulary: Vocabulary,
    loadVocabulary: (iri: IRI) => void,
    loadTypes: (language: string) => void,
    lang: string
}

export class VocabularyDetail extends React.Component<VocabularyDetailProps> {

    public componentDidMount(): void {
        const normalizedName: string = this.props.match.params.name;
        const namespace = Utils.extractQueryParam(this.props.location.search, "namespace");
        if (!this.props.vocabulary || VocabularyUtils.getFragment(this.props.vocabulary.iri) !== normalizedName) {
            this.props.loadVocabulary(VocabularyUtils.create(namespace + normalizedName));
        }
        this.props.loadTypes(this.props.lang);
    }

    public render() {
        const label = this.props.vocabulary.label;

        return <div>
            <h2 className="page-header">
                <OutgoingLink
                    label={label}
                    iri={this.props.vocabulary.iri}
                />
            </h2>
            <Row className="detail-row">
                <Col md={4}>
                    <Terms vocabulary={this.props.vocabulary}/>
                </Col>
                <Col md={8}>
                    <Switch>
                        <BreadcrumbRoute title={this.props.i18n("glossary.createTerm.breadcrumb")}
                                         path={Routes.createVocabularyTerm.path} component={CreateTerm}
                                         includeSearch={true}/>
                        <DynamicBreadcrumbRoute asset="selectedTerm" path={Routes.vocabularyTermDetail.path}
                                                component={TermDetail} includeSearch={true}/>
                        <Route path={Routes.vocabularyDetail.path} component={NoTermSelected} exact={true}/>
                    </Switch>
                </Col>
            </Row>
        </div>;
    }
}

export default connect((state: TermItState) => {
    return {
        vocabulary: state.vocabulary,
        lang: state.intl.locale,
    };
}, (dispatch: ThunkDispatch) => {
    return {
        loadVocabulary: (iri: IRI) => dispatch(loadVocabulary(iri)),
        loadTypes: (lang: string) => dispatch(loadTypes(lang)),
    };
})(injectIntl(withI18n(VocabularyDetail)));
