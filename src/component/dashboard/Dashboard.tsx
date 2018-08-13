import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Col, Grid, Jumbotron, Row} from "react-bootstrap";
import './Dashboard.scss';
import DashboardTile from "./DashboardTile";
import DashboardQuickAccessTile from "./DashboardQuickAccessTile";

class Dashboard extends React.Component<HasI18n>{
    private onClick = () => {
        //
    };

    public render(){
        return <div className='row'><div className='dashboard-left'>
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
        return <Grid fluid={true}>
            <Row>
                <Col xs={4} className='dashboard-sector'>
                    <DashboardTile text={i18n('dashboard.vocabulary.tile')} onClick={this.onClick}/>
                </Col>
                <Col xs={4} className='dashboard-sector'>
                    <DashboardTile text={i18n('dashboard.document.tile')} onClick={this.onClick}/>
                </Col>
                <Col xs={4} className='dashboard-sector'>
                    <DashboardTile text={i18n('dashboard.statistics.tile')} onClick={this.onClick}/>
                </Col>
            </Row>
        </Grid>;
    }

    private renderQuickAccessDashboard() {
        const i18n = this.props.i18n;
        return <Grid fluid={true}>
            <Row>
                <Col xs={4} className='dashboard-sector'>
                    <DashboardQuickAccessTile text={i18n('dashboard.create-vocabulary.tile')} onClick={this.onClick}/>
                </Col>
                <Col xs={4} className='dashboard-sector'>
                    <DashboardQuickAccessTile text={i18n('dashboard.add-document.tile')} onClick={this.onClick}/>
                </Col>
            </Row>
        </Grid>;
    }

}

export default injectIntl(withI18n(Dashboard));
