declare module 'react-fullscreenable' {
    import * as React from "react";

    interface FullscreenableProps {
        toggleFullscreen: () => {},
        isFullscreen : boolean
    }

    export default function Fullscreenable<P>():
        (c: React.ComponentClass<P>) =>
            (React.ComponentClass<P> & { WrappedComponent: React.ComponentClass<P> } & FullscreenableProps);
}
