import * as React from "react";
import {GoInfo} from "react-icons/go";
import {UncontrolledTooltip} from "reactstrap";
import {Placement} from "popper.js";
import "./InfoIcon.scss";

interface InfoIconProps {
    id: string;     // Id of the icon element, necessary for correct tooltip display
    text: string;   // Info message to show
    placement?: Placement; // Where to display the tooltip (relative to the icon). Defaults to "right"
}

const InfoIcon: React.FC<InfoIconProps> = (props) => {
    return <>
        <GoInfo id={props.id} className="info-icon"/>
        <UncontrolledTooltip target={props.id} placement={props.placement}>
            {props.text}
        </UncontrolledTooltip>
    </>;
};

InfoIcon.defaultProps = {
    placement: "right"
};

export default InfoIcon;