import * as React from "react";
import FullscreenablePanelWithActions from "../misc/FullscreenablePanelWithActions";

/**
 * A general widget component for showing in the statistics screen.
 */
interface Props {

    /**
     * Header text of the Widget
     */
    title: string,

    /**
     * The actual component of the widget
     */
    component: JSX.Element

    /**
     * List of actions to show in the header
     */
    actions?: JSX.Element[]
}

export default (props : Props) =>
    <FullscreenablePanelWithActions
        title={props.title}
        actions={props.actions ? props.actions : []}
        component={props.component}/>;
