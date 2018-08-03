import {Route} from "../Routes";

class RoutingMock {
    public saveOriginalTarget = (route: Route) => {
        // Do nothing
    };

    public transitionTo = (route: Route, options = {params: {}}) => {
        // Do nothing
    };

    public transitionToHome = () => {
        // Do nothing
    };

    public transitionToOriginalTarget = () => {
        // Do nothing
    }
}

const INSTANCE = new RoutingMock();

export default INSTANCE;