import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Col, Container, Jumbotron, Row} from "reactstrap";
import './Dashboard.scss';
import DashboardTile from "./DashboardTile";
import DashboardQuickAccessTile from "./DashboardQuickAccessTile";
import Routing from '../../util/Routing';
import Routes from '../../util/Routes';
import TermFrequency from "../statistics/termfrequency/TermFrequency";
import PanelWithActions from "../misc/PanelWithActions";
import templateQuery from "../statistics/termfrequency/TermFrequency.rq";

export class Dashboard extends React.Component<HasI18n> {

    private static onVocabularyManagementClick(): void {
        Routing.transitionTo(Routes.vocabularies);
    };

    private static onResourceManagementClick(): void {
        Routing.transitionTo(Routes.resources);
    };

    private static onSearchClick(): void {
        Routing.transitionTo(Routes.search);
    };

    private static onStatisticsClick(): void {
        Routing.transitionTo(Routes.statistics);
    };

    private static onCreateVocabularyClick(): void {
        Routing.transitionTo(Routes.createVocabulary);
    };

    public render() {
        return <Row>
            <Col lg={8} xs={12}>
                <Jumbotron>
                    {this.renderMainDashboard()}
                </Jumbotron>
                <Jumbotron>
                    {this.renderQuickAccessDashboard()}
                </Jumbotron>
            </Col>
            <Col lg={4} xs={12}>
                <PanelWithActions title={this.props.i18n("dashboard.type-frequency")}>
                    <TermFrequency
                        sparqlQuery={templateQuery}
                        lang={this.props.locale}/>
                </PanelWithActions>
            </Col>
        </Row>;
    }

    private renderMainDashboard() {
        const i18n = this.props.i18n;
        return <Container fluid={true}>
            <Row>
                <Col xs={12} lg={4} className='dashboard-sector'>
                    <DashboardTile text={i18n('dashboard.vocabulary.tile')}
                                   onClick={Dashboard.onVocabularyManagementClick}/>
                </Col>
                <Col xs={12} lg={4} className='dashboard-sector'>
                    <DashboardTile text={i18n('dashboard.resource.tile')}
                                   onClick={Dashboard.onResourceManagementClick}/>
                </Col>
                <Col xs={12} lg={4} className='dashboard-sector'>
                    <DashboardTile text={i18n('dashboard.statistics.tile')} onClick={Dashboard.onStatisticsClick}/>
                </Col>
            </Row>
        </Container>;
    }

    private renderQuickAccessDashboard() {
        const i18n = this.props.i18n;
        return <Container fluid={true}>
            <Row>
                <Col xs={12} lg={4} className='dashboard-sector'>
                    <DashboardQuickAccessTile text={i18n('dashboard.create-vocabulary.tile')}
                                              onClick={Dashboard.onCreateVocabularyClick}/>
                </Col>
                {/*<Col xs={4} className='dashboard-sector'>*/}
                {/*<DashboardQuickAccessTile text={i18n('dashboard.add-document.tile')} onClick={this.onClick}/>*/}
                {/*</Col>*/}
                <Col xs={12} lg={4} className='dashboard-sector'>
                    <DashboardQuickAccessTile text={i18n('dashboard.search.tile')} onClick={Dashboard.onSearchClick}/>
                </Col>
            </Row>
        </Container>;
    }

}

export default injectIntl(withI18n(Dashboard));
