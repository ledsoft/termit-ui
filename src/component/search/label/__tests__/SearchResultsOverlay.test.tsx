import SearchResult from "../../../../model/SearchResult";
import Generator from "../../../../__tests__/environment/Generator";
import Vocabulary from "../../../../util/VocabularyUtils";
import {mountWithIntl} from "../../../../__tests__/environment/Environment";
import {formatMessage, i18n} from "../../../../__tests__/environment/IntlUtil";
import * as React from "react";
import {intlFunctions} from "../../../../__tests__/environment/IntlUtil";
import {MAX_RENDERED_RESULTS, SearchResultsOverlay} from "../SearchResultsOverlay";
import {Simulate} from "react-dom/test-utils";
import {ReactWrapper} from "enzyme";
import {generateResults} from "./Search.test";

describe("SearchResultsOverlay", () => {

    let onClose: () => void;
    let onClick: (r: SearchResult) => void;
    let onOpenSearch: () => void;

    let element: HTMLDivElement;
    let wrapper: ReactWrapper;

    beforeEach(() => {
        onClose = jest.fn();
        onOpenSearch = jest.fn();
        onClick = jest.fn();
        element = document.createElement("div");
        element.id = "root";
        document.body.appendChild(element);
        jest.useFakeTimers();
    });

    afterEach(() => {
        wrapper.unmount();
        jest.clearAllTimers();
        document.body.removeChild(element);
    });

    it.skip("shows only first x search results, others can be viewed on dedicated search page", () => {
        const results = generateResults(Vocabulary.TERM, MAX_RENDERED_RESULTS + 5);
        wrapper = mountWithIntl(<SearchResultsOverlay targetId="root" show={true} searchResults={results}
                                                      onClose={onClose} onClick={onClick}
                                                      onOpenSearch={onOpenSearch} {...intlFunctions()}/>, {attachTo: element});
        const items = document.getElementsByClassName("search-result-link");
        expect(items.length).toEqual(MAX_RENDERED_RESULTS);
    });

    it.skip("renders info message about no results when empty results are provided", () => {
        wrapper = mountWithIntl(<SearchResultsOverlay targetId="root" show={true} searchResults={[]}
                                                      onClose={onClose} onClick={onClick}
                                                      onOpenSearch={onOpenSearch} {...intlFunctions()}/>, {attachTo: element});
        const items = document.getElementsByClassName("search-result-link");
        expect(items.length).toEqual(0);
        expect(document.getElementsByClassName("search-result-no-results").length).toEqual(1);
    });

    it.skip("renders count info when more results than displayable count are provided", () => {
        const results = generateResults(Vocabulary.TERM, MAX_RENDERED_RESULTS + 5);
        wrapper = mountWithIntl(<SearchResultsOverlay targetId="root" show={true} searchResults={results}
                                                      onClose={onClose} onClick={onClick}
                                                      onOpenSearch={onOpenSearch} {...intlFunctions()}/>, {attachTo: element});
        expect(document.getElementsByClassName("search-result-link").length).toEqual(MAX_RENDERED_RESULTS);
        expect(document.getElementsByClassName("search-result-info").length).toEqual(1);
    });

    it.skip("invokes onClick with correct result when result link is clicked", () => {
        const results = generateResults(Vocabulary.TERM, MAX_RENDERED_RESULTS);
        wrapper = mountWithIntl(<SearchResultsOverlay targetId="root" show={true} searchResults={results}
                                                      onClose={onClose} onClick={onClick}
                                                      onOpenSearch={onOpenSearch} {...intlFunctions()}/>, {attachTo: element});
        const index = Generator.randomInt(0, MAX_RENDERED_RESULTS);
        const item = document.getElementsByClassName("search-result-link")[index];
        Simulate.click(item);
        expect(onClick).toHaveBeenCalled();
        expect((onClick as jest.Mock).mock.calls[0][0]).toEqual(results[index]);
    });

    it.skip("invokes search open when no results info link is clicked", () => {
        wrapper = mountWithIntl(<SearchResultsOverlay targetId="root" show={true} searchResults={[]}
                                                      onClose={onClose} onClick={onClick}
                                                      onOpenSearch={onOpenSearch} {...intlFunctions()}/>, {attachTo: element});
        const noResultsInfo = document.getElementsByClassName("search-result-no-results")[0];
        Simulate.click(noResultsInfo);
        expect(onOpenSearch).toHaveBeenCalled();
    });

    it.skip("invokes search open when count info link is clicked", () => {
        const results = generateResults(Vocabulary.TERM, MAX_RENDERED_RESULTS + 5);
        wrapper = mountWithIntl(<SearchResultsOverlay targetId="root" show={true} searchResults={results}
                                                      onClose={onClose} onClick={onClick}
                                                      onOpenSearch={onOpenSearch} {...intlFunctions()}/>, {attachTo: element});
        const infoLink = document.getElementsByClassName("search-result-info")[0];
        Simulate.click(infoLink);
        expect(onOpenSearch).toHaveBeenCalled();
    });

    it("merges duplicate results to prevent rendering issues", () => {
        const iri = Generator.generateUri();
        const results = [new SearchResult({
            iri,
            label: "Result",
            snippetText: "<em>Match</em> multiple times. <em>Match</em> again",
            snippetField: "comment",
            types: [Vocabulary.TERM]
        }), new SearchResult({
            iri,
            label: "Result",
            snippetText: "<em>Match</em> multiple times. <em>Match</em> again",
            snippetField: "comment",
            types: [Vocabulary.TERM]
        })];
        wrapper = mountWithIntl(<SearchResultsOverlay targetId="root" show={true} searchResults={results}
                                                      onClose={onClose} onClick={onClick}
                                                      onOpenSearch={onOpenSearch} {...intlFunctions()}/>, {attachTo: element});
        const items = document.getElementsByClassName("search-result-link");
        expect(items.length).toEqual(1);
    });

    it("reports correct result count after merging duplicates", () => {
        const results = generateResults(Vocabulary.TERM, MAX_RENDERED_RESULTS + 5);
        results.push(results[0].copy());
        wrapper = mountWithIntl(<SearchResultsOverlay targetId="root" show={true} searchResults={results}
                                                      onClose={onClose} onClick={onClick}
                                                      onOpenSearch={onOpenSearch} {...intlFunctions()}/>, {attachTo: element});
        const infoLink = document.getElementsByClassName("search-result-info")[0];
        const expCount = results.length - 1;
        expect(infoLink.textContent).toContain(expCount.toString());
    });
});
