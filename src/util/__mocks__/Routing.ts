class RoutingMock {
    public saveOriginalTarget = jest.fn();

    public transitionTo = jest.fn();

    public transitionToHome = jest.fn();

    public transitionToOriginalTarget = jest.fn();
}

const INSTANCE = new RoutingMock();

export default INSTANCE;