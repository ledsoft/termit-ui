import {Routing} from "../Routing";
import RoutingInstance from "../Routing";
import Routes from "../Routes";
import {createHashHistory} from "history";

jest.mock("history", () => ({
    createHashHistory: jest.fn().mockReturnValue({
        push: jest.fn()
    })
}));

describe("Routing", () => {

    const historyMock = createHashHistory();

    beforeEach(() => {
        jest.resetAllMocks()
    });

    describe("get transition path", () => {
        it("replaces path variables with values", () => {
            const name = "test-vocabulary";
            const path = Routing.getTransitionPath(Routes.vocabularyDetail, {params: new Map([["name", name]])});
            const expectedPath = Routes.vocabularyDetail.path.replace(":name", name);
            expect(path).toEqual(expectedPath);
        });
        it("adds query parameters when specified for transition", () => {
            const namespace = "http://onto.fel.cvut.cz/ontologies/termit/vocabulary/";
            const path = Routing.getTransitionPath(Routes.vocabularies, {query: new Map([["namespace", namespace]])});
            const expectedPath = Routes.vocabularies.path.replace(":name", name)+"?namespace="+namespace;
            expect(path).toEqual(expectedPath);
        });
    });

    describe("transition to", () => {
        it("transitions to route without any parameter", () => {
            RoutingInstance.transitionTo(Routes.vocabularies);
            expect(historyMock.push).toHaveBeenCalledWith(Routes.vocabularies.path);
        });
    });
});