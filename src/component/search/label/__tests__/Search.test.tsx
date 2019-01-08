import * as React from "react";
import {mountWithIntl} from "../../../../__tests__/environment/Environment";
import {intlFunctions} from "../../../../__tests__/environment/IntlUtil";
import SearchResult, {SearchResultData} from "../../../../model/SearchResult";
import {Search} from "../Search";
import {Button} from "reactstrap";
import {createMemoryHistory, Location} from "history";
import {match} from "react-router";
import Generator from "../../../../__tests__/environment/Generator";
import VocabularyUtils from "../../../../util/VocabularyUtils";

jest.mock("../../../../util/Routing");

export function generateResults(type: string, count: number = 5): SearchResult[] {
    const results: SearchResult[] = [];
    for (let i = 0; i < count; i++) {
        const resData: SearchResultData = {
            iri: Generator.generateUri(),
            label: "Result " + i,
            snippetText: "<em>Match</em>",
            snippetField: "label",
            types: [type]
        };
        if (type === VocabularyUtils.TERM) {
            resData.vocabulary = {iri: "http://onto.fel.cvut.cz/ontologies/termit/vocabularies/vocabulary-" + i};
        }
        results.push(new SearchResult(resData));
    }
    return results;
}

describe("Search", () => {

    const history = createMemoryHistory();
    const routeMatch: match<any> = {
        params: {},
        isExact: true,
        path: "",
        url: ""
    };
    let search: (str: string) => Promise<SearchResult[]>;
    let location: Location;

    beforeEach(() => {
        search = jest.fn().mockImplementation(() => Promise.resolve([]));
        location = {
            pathname: "",
            search: "",
            hash: "",
            state: null
        }
    });

    it("invokes search when input is added to search field and search button is clicked", () => {
        const value = "test";
        const wrapper = mountWithIntl(<Search search={search} location={location} history={history}
                                              match={routeMatch} {...intlFunctions()}/>);
        const input = wrapper.find("input.search-input");
        (input.getDOMNode() as HTMLInputElement).value = value;
        input.simulate("change", input);
        wrapper.find(Button).simulate("click");
        expect(search).toHaveBeenCalledWith(value);
    });

    it("invokes search when location contains search query parameter", () => {
        const value = "test";
        location.search = "searchString=" + value;
        mountWithIntl(<Search search={search} location={location} history={history}
                              match={routeMatch} {...intlFunctions()}/>);
        expect(search).toHaveBeenCalledWith(value);
    });

    it("invokes search when input is added and enter is pressed", () => {
        const value = "test";
        const wrapper = mountWithIntl(<Search search={search} location={location} history={history}
                                              match={routeMatch} {...intlFunctions()}/>);
        const input = wrapper.find("input.search-input");
        (input.getDOMNode() as HTMLInputElement).value = value;
        input.simulate("change", input);
        input.simulate("keyPress", {key: "Enter"});
        expect(search).toHaveBeenCalledWith(value);
    });
});