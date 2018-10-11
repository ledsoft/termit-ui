import * as React from 'react';
import {Card, CardBody, CardHeader} from 'reactstrap';

interface PanelWithActionsProps {
    title: string,
    actions: JSX.Element[],
    component: JSX.Element,
    className?: string,

}

export default (props: PanelWithActionsProps) => <Card style={{zIndex: 200}}>
    <CardHeader tag='h5' color='info' className='d-flex align-items-center'>
        <div className='flex-grow-1'>{props.title}</div>
        <div className="float-sm-right">
            {props.actions}
        </div>
    </CardHeader>
    <CardBody className={props.className}>
        {props.component}
    </CardBody>
</Card>;