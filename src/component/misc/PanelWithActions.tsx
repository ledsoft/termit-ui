import * as React from "react";
import {Card, CardBody, CardHeader} from "reactstrap";

interface PanelWithActionsProps {
    title: JSX.Element | string,
    actions?: JSX.Element[],
    className?: string,
}

export default class PanelWithActions extends React.Component<PanelWithActionsProps> {
    public render() {
        const props = this.props;
        return <Card>
            <CardHeader tag="h4" color="primary" className="d-flex align-items-center">
                <div className="flex-grow-1">{props.title}</div>
                <div className="float-sm-right">
                    {props.actions ? props.actions : ""}
                </div>
            </CardHeader>
            <CardBody className={props.className}>
                {props.children}
            </CardBody>
        </Card>;
    }
}
