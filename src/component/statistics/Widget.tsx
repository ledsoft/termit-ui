import * as React from "react";
import FullscreenablePanelWithActions from "../misc/FullscreenablePanelWithActions";

interface Props {
    title: string,
    component: JSX.Element
    actions?: JSX.Element[]
}

const Widget: React.SFC<Props> = props => {
    return (<FullscreenablePanelWithActions
            title={props.title}
            actions={props.actions ? props.actions : []}
            component={props.component}/>);
};

export default Widget;
