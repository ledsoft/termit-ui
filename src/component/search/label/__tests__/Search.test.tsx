import * as React from "react";
import {mountWithIntl} from "../../../../__tests__/environment/Environment";
import {intlFunctions} from "../../../../__tests__/environment/IntlUtil";
import SearchResult, {SearchResultData} from "../../../../model/SearchResult";
import {Search} from "../Search";
import {Button} from "reactstrap";
import {createMemoryHistory, Location} from "history";
import {match, MemoryRouter} from "react-router";
import Generator from "../../../../__tests__/environment/Generator";
import VocabularyUtils from "../../../../util/VocabularyUtils";
import Routing from "../../../../util/Routing";
import Routes from "../../../../util/Routes";
import SearchQuery from "../../../../model/SearchQuery";

jest.mock("../../../../util/Routing");

export function generateResults(type: string, count: number = 5): SearchResult[] {
    const results: SearchResult[] = [];
    for (let i = 0; i < count; i++) {
        const resData: SearchResultData = {
            iri: Generator.generateUri(),
            label: "Result " + i,
            types: [type],
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
    let addSearchListener: () => Promise<object>;
    let removeSearchListener: () => Promise<object>;
    let location: Location;

    const searchConnections = () => {
        return {search, addSearchListener, removeSearchListener};
    };

    const searchProps = () => {
        return {
            searchQuery: new SearchQuery(),
            searchResults: [],
            searchInProgress: false,
        };
    };

    beforeEach(() => {
        search = jest.fn().mockImplementation(() => Promise.resolve([]));
        addSearchListener = jest.fn().mockImplementation(() => Promise.resolve([]));
        removeSearchListener = jest.fn().mockImplementation(() => Promise.resolve([]));
        location = {
            pathname: "",
            search: "",
            hash: "",
            state: null
        };
    });

    it.skip("invokes search when input is added to search field and search button is clicked", () => {
        const value = "test";
        const wrapper = mountWithIntl(<MemoryRouter><Search {...searchProps()} {...searchConnections()} location={location} history={history}
                                                            match={routeMatch} {...intlFunctions()}/></MemoryRouter>);
        const input = wrapper.find("input.search-input");
        (input.getDOMNode() as HTMLInputElement).value = value;
        input.simulate("change", input);
        wrapper.find(Button).simulate("click");
        expect(search).toHaveBeenCalledWith(value);
    });

    it.skip("invokes search when location contains search query parameter", () => {
        const value = "test";
        location.search = "searchString=" + value;
        mountWithIntl(<MemoryRouter><Search {...searchProps()} {...searchConnections()} location={location} history={history}
                                            match={routeMatch} {...intlFunctions()}/></MemoryRouter>);
        expect(search).toHaveBeenCalledWith(value);
    });

    it.skip("invokes search when input is added and enter is pressed", () => {
        const value = "test";
        const wrapper = mountWithIntl(<MemoryRouter><Search {...searchProps()} {...searchConnections()} location={location} history={history}
                                                            match={routeMatch} {...intlFunctions()}/></MemoryRouter>);
        const input = wrapper.find("input.search-input");
        (input.getDOMNode() as HTMLInputElement).value = value;
        input.simulate("change", input);
        input.simulate("keyPress", {key: "Enter"});
        expect(search).toHaveBeenCalledWith(value);
    });

    it.skip("renders term results", () => {
        const value = "test";
        location.search = "searchString=" + value;
        const results = generateResults(VocabularyUtils.TERM);
        search = jest.fn().mockImplementation(() => Promise.resolve(results));
        const wrapper = mountWithIntl(<MemoryRouter><Search {...searchProps()} {...searchConnections()} location={location} history={history}
                                                            match={routeMatch} {...intlFunctions()}/></MemoryRouter>);
        return search("").then(() => {
            wrapper.update();
            expect(wrapper.find(".search-result-item").length).toEqual(results.length);
        });
    });

    it.skip("renders vocabulary results", () => {
        const value = "test";
        location.search = "searchString=" + value;
        const results = generateResults(VocabularyUtils.VOCABULARY);
        search = jest.fn().mockImplementation(() => Promise.resolve(results));
        const wrapper = mountWithIntl(<MemoryRouter><Search {...searchProps()} {...searchConnections()} location={location} history={history}
                                                            match={routeMatch} {...intlFunctions()}/></MemoryRouter>);
        return search("").then(() => {
            wrapper.update();
            expect(wrapper.find(".search-result-item").length).toEqual(results.length);
        });
    });

    it.skip("transitions to vocabulary detail when vocabulary result is clicked", () => {
        const value = "test";
        location.search = "searchString=" + value;
        const results = generateResults(VocabularyUtils.VOCABULARY);
        search = jest.fn().mockImplementation(() => Promise.resolve(results));
        const wrapper = mountWithIntl(<MemoryRouter><Search {...searchProps()} {...searchConnections()} location={location} history={history}
                                                            match={routeMatch} {...intlFunctions()}/></MemoryRouter>);
        return search("").then(() => {
            wrapper.update();
            wrapper.findWhere(node => node.key() === results[0].iri).simulate("click");
            const resultIri = VocabularyUtils.create(results[0].iri);
            expect(Routing.transitionTo).toHaveBeenCalledWith(Routes.vocabularySummary, {
                params: new Map([["name", resultIri.fragment]]),
                query: new Map([["namespace", resultIri.namespace]])
            });
        });
    });

    it.skip("transitions to term detail when term result is clicked", () => {
        const value = "test";
        location.search = "searchString=" + value;
        const results = generateResults(VocabularyUtils.TERM);
        search = jest.fn().mockImplementation(() => Promise.resolve(results));
        const wrapper = mountWithIntl(<MemoryRouter><Search {...searchProps()} {...searchConnections()} location={location} history={history}
                                                            match={routeMatch} {...intlFunctions()}/></MemoryRouter>);
        return search("").then(() => {
            wrapper.update();
            wrapper.findWhere(node => node.key() === results[0].iri).simulate("click");
            const vocabIri = VocabularyUtils.create(results[0].vocabularyIri!);
            expect(Routing.transitionTo).toHaveBeenCalledWith(Routes.vocabularyTermDetail,
                {
                    params: new Map([["termName", VocabularyUtils.getFragment(results[0].iri)], ["name", vocabIri.fragment]]),
                    query: new Map([["namespace", vocabIri.namespace]])
                });
        });
    });
});
