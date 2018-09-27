import * as React from "react";

/**
 * This component only remounts the wrapped component each time the props change.
 * Use-case - Angular component embedded in React.
 */

export default function remount<P>(Component: React.ComponentType<P>): any {

    interface State {
        component: JSX.Element | null
    }

    return class extends React.Component<P, State> {
        constructor(props:P) {
            super(props);
            this.state = {
                component: null
            };
        }

        public componentDidMount() {
            this.change(true);
        }

        public componentDidUpdate(prevProps: P) {
            this.change(prevProps !== this.props);
        }

        private change(changed: boolean) {
            if (changed) {
                this.setState({
                    component: null
                });
            } else if (this.state.component == null) {
                this.setState({
                    component : <Component {...this.props}/>
                });
            }
        }

        public render() {
            return this.state.component;
        }
    }
}