import * as React from "react";
import PanelWithActions from "../misc/PanelWithActions";
import {FullscreenButton} from "./FullscreenButton";
import withFullscreen from "react-fullscreenable";

interface Props {
    title: string,
    component: JSX.Element
    actions: JSX.Element[],
    isFullscreen: boolean,
    toggleFullscreen: () => void
}
class FullscreenablePanelWithActions extends React.Component<Props> {

    public render() {
        const props = this.props;
        const components = [...(props.actions || [])];
        components.push(<FullscreenButton key="btnFullscreen"
                                          isFullscreen={props.isFullscreen}
                                          toggleFullscreen={props.toggleFullscreen}/>);
        return (
            <PanelWithActions
                title={props.title}
                actions={components}
                component={props.component}/>);
    }
};

export default withFullscreen(FullscreenablePanelWithActions)(FullscreenablePanelWithActions);