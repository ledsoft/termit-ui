import * as React from "react";
import {Popover, PopoverBody, PopoverHeader} from "reactstrap";

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
    <Popover placement="auto"
             isOpen={props.isOpen}
             target={props.target}
             toggle={props.toggle}>
        <PopoverHeader>
            <span className="pwa-popup-title">{props.title}</span>
            <div className="float-sm-right">
                {props.actions}
            </div>
        </PopoverHeader>
        <PopoverBody>
            {props.component}
        </PopoverBody>
    </Popover>;


