import * as React from "react";
import {ButtonToolbar, Popover, PopoverBody, PopoverHeader} from "reactstrap";

interface PopupWithActionsProps {
    title: string,
    actions: JSX.Element[],
    component: JSX.Element,
    isOpen: boolean,
    isEditable: boolean,
    target: any,
    toggle: any
}

export default (props: PopupWithActionsProps) =>
    <Popover placement="auto" className="pwa"
             isOpen={props.isOpen}
             target={props.target}
             toggle={props.toggle}>
        <PopoverHeader className="d-flex align-items-center">
            <div className="pwa-popup-title flex-grow-1">{props.title}</div>
            <ButtonToolbar className="float-sm-right">
                {props.actions}
            </ButtonToolbar>
        </PopoverHeader>
        <PopoverBody>
            {props.component}
        </PopoverBody>
    </Popover>;


