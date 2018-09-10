'use strict';

import * as React from "react";
import {Button} from "reactstrap";
import { IconContext } from "react-icons";
import {GoScreenFull,GoScreenNormal} from "react-icons/go";

interface Props {
    isFullscreen: boolean,
    toggleFullscreen: () => void
}

export const FullscreenButton: React.SFC<Props> = props => (<Button
    key="btnFullscreen"
    color='light'
    size='sm'
    onClick={props.toggleFullscreen}
    title={props.isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}>
    <IconContext.Provider value={{ color: "blue", className: "global-class-name" }}>
        {props.isFullscreen ? <GoScreenNormal/> : <GoScreenFull/> }
    </IconContext.Provider>
</Button>);
