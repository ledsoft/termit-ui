import * as React from "react";
import {NavbarSearch} from "../NavbarSearch";
import {intlFunctions} from "../../../../__tests__/environment/IntlUtil";
import SearchResultsOverlay from "../SearchResultsOverlay";
import {createMemoryHistory, Location} from "history";
import {match as Match} from "react-router";
import Routes from "../../../../util/Routes";
import {shallow} from "enzyme";
import SearchResult from "../../../../model/SearchResult";
import Generator from "../../../../__tests__/environment/Generator";
import VocabularyUtils from "../../../../util/VocabularyUtils";
import Routing from "../../../../util/Routing";

jest.mock("../../../../util/Routing");

describe("NavbarSearch", () => {

    let updateSearchFilter: () => Promise<object>;

    let location: Location;
    const history = createMemoryHistory();
    let match: Match<any>;

    const searchResults = [new SearchResult({
        iri: Generator.generateUri(),
        label: "test",
        snippetField: "label",
        snippetText: "<em>label</em>",
        types: [VocabularyUtils.VOCABULARY]
    })];

    const navbarConnections = () => {
        return {updateSearchFilter, location, history, match};
    };

    beforeEach(() => {
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
        const wrapper = shallow(<NavbarSearch searchString=""
                                              searchResults={null} {...navbarConnections()} {...intlFunctions()}/>);
        const resultsOverlay = wrapper.find(SearchResultsOverlay);
        expect(resultsOverlay.exists()).toBeFalsy();
    });

    it("invokes search on change", () => {
        const wrapper = shallow<NavbarSearch>(<NavbarSearch searchString=""
                                                            searchResults={null} {...navbarConnections()} {...intlFunctions()}/>);
        const searchStr = "test";
        const input = wrapper.find("#main-search-input");
        input.simulate("change", {target: {value: searchStr}});
        return Promise.resolve().then(() => {
            expect(updateSearchFilter).toHaveBeenCalled();
        });
    });

    it("does not display search results when current route is search", () => {
        location.pathname = Routes.search.path;
        match.path = Routes.search.path;
        const wrapper = shallow<NavbarSearch>(<NavbarSearch searchString=""
                                                            searchResults={searchResults} {...navbarConnections()} {...intlFunctions()}/>);
        wrapper.setState({showResults: true});
        wrapper.update();
        expect(wrapper.find(SearchResultsOverlay).prop("show")).toBeFalsy();
    });

    it("does not display search results when current route is term search", () => {
        location.pathname = Routes.searchTerms.path;
        match.path = Routes.searchTerms.path;
        const wrapper = shallow<NavbarSearch>(<NavbarSearch searchString=""
                                                            searchResults={searchResults} {...navbarConnections()} {...intlFunctions()}/>);
        wrapper.setState({showResults: true});
        wrapper.update();
        expect(wrapper.find(SearchResultsOverlay).prop("show")).toBeFalsy();
    });

    it("does not display search results when current route is vocabulary search", () => {
        location.pathname = Routes.searchVocabularies.path;
        match.path = Routes.searchVocabularies.path;
        const wrapper = shallow<NavbarSearch>(<NavbarSearch searchString=""
                                                            searchResults={searchResults} {...navbarConnections()} {...intlFunctions()}/>);
        wrapper.setState({showResults: true});
        wrapper.update();
        expect(wrapper.find(SearchResultsOverlay).prop("show")).toBeFalsy();
    });

    it("does not display search results when current route is faceted search", () => {
        location.pathname = Routes.facetedSearch.path;
        match.path = Routes.facetedSearch.path;
        const wrapper = shallow<NavbarSearch>(<NavbarSearch searchString=""
                                                            searchResults={searchResults} {...navbarConnections()} {...intlFunctions()}/>);
        wrapper.setState({showResults: true});
        wrapper.update();
        expect(wrapper.find(SearchResultsOverlay).prop("show")).toBeFalsy();
    });

    it("renders results when they are available", () => {
        const wrapper = shallow<NavbarSearch>(<NavbarSearch searchString=""
                                                            searchResults={searchResults} {...navbarConnections()} {...intlFunctions()}/>);
        wrapper.setState({showResults: true});
        wrapper.update();
        expect(wrapper.find(SearchResultsOverlay).prop("show")).toBeTruthy();
        expect(wrapper.find(SearchResultsOverlay).prop("searchResults")).toEqual(searchResults);
    });

    it("hides results when route changes", () => {
        const wrapper = shallow<NavbarSearch>(<NavbarSearch searchString=""
                                                            searchResults={searchResults} {...navbarConnections()} {...intlFunctions()}/>);
        wrapper.setState({showResults: true});
        wrapper.update();
        expect(wrapper.find(SearchResultsOverlay).prop("show")).toBeTruthy();
        const newLoc = Object.assign({}, location, {pathname: Routes.resources.path});
        const newMatch = Object.assign({}, match, {path: Routes.resources.path});
        wrapper.setProps({location: newLoc, match: newMatch});
        wrapper.update();
        expect(wrapper.find(SearchResultsOverlay).prop("show")).toBeFalsy();
    });

    it("transitions to search view when user clicks on the search icon", () => {
        const wrapper = shallow<NavbarSearch>(<NavbarSearch searchString=""
                                                            searchResults={null} {...navbarConnections()} {...intlFunctions()}/>);
        wrapper.find("#main-search-icon-button").simulate("click");
        expect(Routing.transitionTo).toHaveBeenCalledWith(Routes.search, {query: new Map()});
    });

    it("transitions to search view on enter", () => {
        const searchString = "test";
        const wrapper = shallow<NavbarSearch>(<NavbarSearch searchString={searchString}
                                                            searchResults={null} {...navbarConnections()} {...intlFunctions()}/>);
        const input = wrapper.find("#main-search-input");
        input.simulate("keyPress", {key: "Enter"});
        expect(Routing.transitionTo).toHaveBeenCalledWith(Routes.search, {query: new Map()});
    });

    it("passes search string as query parameter when transitioning to search view", () => {
        const searchString = "test";
        const wrapper = shallow<NavbarSearch>(<NavbarSearch searchString={searchString}
                                                            searchResults={null} {...navbarConnections()} {...intlFunctions()}/>);
        wrapper.find("#main-search-icon-button").simulate("click");
        expect(Routing.transitionTo).toHaveBeenCalledWith(Routes.search, {query: new Map([["searchString", searchString]])});
    });
});
