import * as React from 'react';
import {ButtonToolbar, Card, CardBody, CardHeader, Col, Row} from 'reactstrap';

interface PanelWithActionsProps {
    title: string,
    actions: JSX.Element[],
    component: JSX.Element
}

export default (props: PanelWithActionsProps) => <Card>
    <CardHeader color='info'>
        <Row>
            <Col xs={6}><h5>{props.title}</h5></Col>
            <Col xs={6}>
                <ButtonToolbar className="pull-right">
                    {props.actions}
                </ButtonToolbar>
            </Col>
        </Row>
    </CardHeader>
    <CardBody>
        <Row>
            <Col md={12}>
                {props.component}
            </Col>
        </Row>
    </CardBody>
</Card>;