import * as React from "react";
import PanelWithActions from "../misc/PanelWithActions";
import {FullscreenButton} from "./FullscreenButton";
import Fullscreenable, {FullscreenableProps} from "react-fullscreenable";

interface Props {
    title: string,
    component: JSX.Element,
    actions: JSX.Element[],
}

class FullscreenablePanelWithActions extends React.Component<Props & FullscreenableProps> {

    constructor(props : Props & FullscreenableProps) {
        super(props);
    }

    public render() {
        const props = this.props;
        const components = [...(props.actions || [])];
        components.push(<FullscreenButton key="btnFullscreen"
                                          isFullscreen={this.props.isFullscreen}
                                          toggleFullscreen={this.props.toggleFullscreen}/>);
        return (
            <PanelWithActions
                title={props.title}
                actions={components}
                component={props.component}/>);
    }
};

export default Fullscreenable<Props>()(FullscreenablePanelWithActions);