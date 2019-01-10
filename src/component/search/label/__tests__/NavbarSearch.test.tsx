import * as React from "react";
import {NavbarSearch} from "../NavbarSearch";
import {mountWithIntl} from "../../../../__tests__/environment/Environment";
import {intlFunctions} from "../../../../__tests__/environment/IntlUtil";
import SearchResultsOverlay from "../SearchResultsOverlay";

jest.mock("../../../../util/Routing");

describe("NavbarSearch", () => {

    let search: (str: string) => Promise<object>;
    let autocompleteSearch: (str: string) => Promise<object>;
    let updateSearchFilter: () => Promise<object>;

    const navbarConnections = () => {
        return {search, autocompleteSearch, updateSearchFilter};
    };

    beforeEach(() => {
        search = jest.fn().mockImplementation(() => Promise.resolve([]));
        autocompleteSearch = jest.fn().mockImplementation(() => Promise.resolve([]));
        updateSearchFilter = jest.fn().mockImplementation(() => Promise.resolve([]));
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

});
