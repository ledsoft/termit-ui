import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Col, Container, Jumbotron, Row} from "reactstrap";
import './Dashboard.scss';
import DashboardTile from "./DashboardTile";
import DashboardQuickAccessTile from "./DashboardQuickAccessTile";
import Routing from '../../util/Routing';
import Routes from '../../util/Routes';

export class Dashboard extends React.Component<HasI18n> {

    private static onVocabularyManagementClick(): void {
        Routing.transitionTo(Routes.vocabularies);
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

    private static onResourcesClick(): void {
        Routing.transitionTo(Routes.resources);
    };

    public render() {
        return <div className='row'>
            <div className='dashboard-left'>
                <Jumbotron>
                    {this.renderMainDashboard()}
                </Jumbotron>
                <Jumbotron>
                    {this.renderQuickAccessDashboard()}
                </Jumbotron>
            </div>
        </div>;
    }

    private renderMainDashboard() {
        const i18n = this.props.i18n;
        return <Container fluid={true}>
            <Row>
                <Col xs={4} className='dashboard-sector'>
                    <DashboardTile text={i18n('dashboard.vocabulary.tile')}
                                   onClick={Dashboard.onVocabularyManagementClick}/>
                </Col>
                {/*<Col xs={4} className='dashboard-sector'>*/}
                {/*<DashboardTile text={i18n('dashboard.document.tile')} onClick={this.onClick}/>*/}
                {/*</Col>*/}
                <Col xs={4} className='dashboard-sector'>
                    <DashboardTile text={i18n('dashboard.statistics.tile')} onClick={Dashboard.onStatisticsClick}/>
                </Col>
                <Col xs={4} className='dashboard-sector'>
                    <DashboardTile text={i18n('dashboard.resources.tile')} onClick={Dashboard.onResourcesClick}/>
                </Col>
            </Row>
        </Container>;
    }

    private renderQuickAccessDashboard() {
        const i18n = this.props.i18n;
        return <Container fluid={true}>
            <Row>
                <Col xs={4} className='dashboard-sector'>
                    <DashboardQuickAccessTile text={i18n('dashboard.create-vocabulary.tile')}
                                              onClick={Dashboard.onCreateVocabularyClick}/>
                </Col>
                {/*<Col xs={4} className='dashboard-sector'>*/}
                {/*<DashboardQuickAccessTile text={i18n('dashboard.add-document.tile')} onClick={this.onClick}/>*/}
                {/*</Col>*/}
                <Col xs={4} className='dashboard-sector'>
                    <DashboardQuickAccessTile text={i18n('dashboard.search.tile')} onClick={Dashboard.onSearchClick}/>
                </Col>
            </Row>
        </Container>;
    }

}

export default injectIntl(withI18n(Dashboard));
