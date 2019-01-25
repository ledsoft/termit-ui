import * as React from "react";
import {NavbarSearch} from "../NavbarSearch";
import {mountWithIntl} from "../../../../__tests__/environment/Environment";
import {intlFunctions} from "../../../../__tests__/environment/IntlUtil";
import SearchResultsOverlay from "../SearchResultsOverlay";
import {Location} from "history";
import createMemoryHistory from "history/createMemoryHistory";
import {match as Match} from "react-router";
import Routes from "../../../../util/Routes";

jest.mock("../../../../util/Routing");

describe("NavbarSearch", () => {

    let search: (str: string) => Promise<object>;
    let autocompleteSearch: (str: string) => Promise<object>;
    let updateSearchFilter: () => Promise<object>;

    let location: Location;
    const history = createMemoryHistory();
    let match: Match<any>;

    const navbarConnections = () => {
        return {search, autocompleteSearch, updateSearchFilter, location, history, match};
    };

    beforeEach(() => {
        search = jest.fn().mockImplementation(() => Promise.resolve([]));
        autocompleteSearch = jest.fn().mockImplementation(() => Promise.resolve([]));
        updateSearchFilter = jest.fn().mockImplementation(() => Promise.resolve([]));

        location = {
            pathname: "/",
            search: "",
            hash: "",
            state: {}
        };
        match = {
            params: {},
            path: location.pathname,
            isExact: true,
            url: "http://localhost:3000/" + location.pathname
        };
    });

    it("does not render results component for initial state", () => {
        const wrapper = mountWithIntl(<NavbarSearch searchString="" {...navbarConnections()} {...intlFunctions()}/>);
        const resultsOverlay = wrapper.find(SearchResultsOverlay);
        expect(resultsOverlay.exists()).toBeFalsy();
    });

    it("invokes search on change", () => {
        const div = document.createElement("div");
        document.body.appendChild(div);
        const wrapper = mountWithIntl(<NavbarSearch searchString="" {...navbarConnections()} {...intlFunctions()}/>, {attachTo: div});
        const searchStr = "test";
        const input = wrapper.find("input");
        (input.getDOMNode() as HTMLInputElement).value = searchStr;
        input.simulate("change", input);
        return Promise.resolve().then(() => {
            expect(updateSearchFilter).toHaveBeenCalled();
        });
    });

    it("does not run search when current route is search", () => {
        const div = document.createElement("div");
        document.body.appendChild(div);
        location.pathname = Routes.search.path;
        match.path = Routes.search.path;
        const wrapper = mountWithIntl(<NavbarSearch searchString="" {...navbarConnections()} {...intlFunctions()}/>, {attachTo: div});
        const searchStr = "test";
        const input = wrapper.find("input");
        (input.getDOMNode() as HTMLInputElement).value = searchStr;
        input.simulate("change", input);
        return Promise.resolve().then(() => {
            expect(autocompleteSearch).not.toHaveBeenCalled();
        });
    });

    it("does not run search when current route is term search", () => {
        const div = document.createElement("div");
        document.body.appendChild(div);
        location.pathname = Routes.searchTerms.path;
        match.path = Routes.searchTerms.path;
        const wrapper = mountWithIntl(<NavbarSearch searchString="" {...navbarConnections()} {...intlFunctions()}/>, {attachTo: div});
        const searchStr = "test";
        const input = wrapper.find("input");
        (input.getDOMNode() as HTMLInputElement).value = searchStr;
        input.simulate("change", input);
        return Promise.resolve().then(() => {
            expect(autocompleteSearch).not.toHaveBeenCalled();
        });
    });
});
