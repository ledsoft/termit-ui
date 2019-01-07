import * as React from "react";
import {CardBody, CardHeader, Popover, PopoverBody, PopoverHeader} from "reactstrap";

interface PopupWithActionsProps {
    title: string,
    actions: JSX.Element[],
    component: JSX.Element,
    isOpen: any,
    target: any,
    toggle: any
}

export default (props: PopupWithActionsProps) =>
    <Popover placement="auto" isOpen={props.isOpen} target={props.target} toggle={props.toggle}>
        <PopoverHeader>
            <CardHeader tag='h6' color='info'>
                {props.title}
                <div className="float-sm-right">
                    {props.actions}
                </div>
            </CardHeader>
        </PopoverHeader>
        <PopoverBody>
            <CardBody>
            {props.component}
            </CardBody>
        </PopoverBody>
    </Popover>;


