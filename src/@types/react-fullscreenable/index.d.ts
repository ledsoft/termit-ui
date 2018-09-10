declare module 'react-fullscreenable' {
    import * as React from "react";

    interface FullscreenableProps {
        forcePseudoFullscreen: boolean,
        isPseudoFullscreen: boolean,
        onFullscreenChange: () => {}
    }

    export default function withFullscreen<P>(c: React.ComponentClass<P>):
        (c2: React.ComponentClass<P>) =>
            (React.ComponentClass<P> & { WrappedComponent: React.ComponentClass<P> } & FullscreenableProps);
}
