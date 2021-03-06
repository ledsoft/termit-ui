import * as React from "react";
import {mountWithIntl} from "../../../../__tests__/environment/Environment";
import {SearchResults} from "../SearchResults";
import {intlFunctions} from "../../../../__tests__/environment/IntlUtil";
import {Label} from "reactstrap";
import en from "../../../../i18n/en";
import SearchResult from "../../../../model/SearchResult";
import Generator from "../../../../__tests__/environment/Generator";
import VocabularyUtils from "../../../../util/VocabularyUtils";
import TermBadge from "../../../badge/TermBadge";
import VocabularyBadge from "../../../badge/VocabularyBadge";
import {FTSMatch} from "../FTSMatch";
import {Link, MemoryRouter} from "react-router-dom";
import VocabularyLink from "../../../vocabulary/VocabularyLink";
import {TermLink} from "../../../term/TermLink";

jest.mock("../../../../util/Routing");

describe("SearchResults", () => {

    it("render no results info when no results are found", () => {
        const wrapper = mountWithIntl(<SearchResults results={[]} {...intlFunctions()}/>);
        const label = wrapper.find(Label);
        expect(label.exists()).toBeTruthy();
        expect(label.text()).toContain(en.messages["main.search.no-results"]);
    });

    function generateTermResult(score?: number) {
        return new SearchResult({
            iri: Generator.generateUri(),
            label: "Test",
            snippetText: "<em>Match</em>",
            snippetField: "label",
            score,
            vocabulary: {iri: Generator.generateUri()},
            types: [VocabularyUtils.TERM]
        });
    }

    it("renders term results", () => {
        const result = generateTermResult();
        const wrapper = mountWithIntl(<MemoryRouter><SearchResults
            results={[result]} {...intlFunctions()}/></MemoryRouter>);
        const rows = wrapper.find("tr");
        // Header + result row
        expect(rows.length).toEqual(2);
        expect(rows.find(TermBadge).exists()).toBeTruthy();
        const label = wrapper.find(Link);
        expect(label.text()).toEqual(result.label);
    });

    function generateVocabularyResult(score?: number) {
        return new SearchResult({
            iri: Generator.generateUri(),
            label: "Test",
            snippetText: "<em>Match</em>",
            snippetField: "label",
            score,
            types: [VocabularyUtils.VOCABULARY]
        });
    }

    it("renders vocabulary results", () => {
        const result = generateVocabularyResult();
        const wrapper = mountWithIntl(<MemoryRouter><SearchResults
            results={[result]} {...intlFunctions()}/></MemoryRouter>);
        const rows = wrapper.find("tr");
        // Header + result row
        expect(rows.length).toEqual(2);
        expect(rows.find(VocabularyBadge).exists()).toBeTruthy();
        const label = wrapper.find(Link);
        expect(label.text()).toEqual(result.label);
    });

    it("renders both vocabulary and term results", () => {
        const results = [generateTermResult(), generateVocabularyResult()];
        const wrapper = mountWithIntl(<MemoryRouter><SearchResults
            results={results} {...intlFunctions()}/></MemoryRouter>);
        const rows = wrapper.find("tr");
        // Header + result row
        expect(rows.length).toEqual(3);
        expect(rows.find(TermBadge).length).toEqual(1);
        expect(rows.find(VocabularyBadge).length).toEqual(1);
    });

    it("renders VocabularyLink for vocabulary result", () => {
        const result = generateVocabularyResult();
        const wrapper = mountWithIntl(<MemoryRouter><SearchResults
            results={[result]} {...intlFunctions()}/></MemoryRouter>);
        expect(wrapper.find(VocabularyLink).exists()).toBeTruthy();
    });

    it("renders TermLink for term result", () => {
        const result = generateTermResult();
        const wrapper = mountWithIntl(<MemoryRouter><SearchResults
            results={[result]} {...intlFunctions()}/></MemoryRouter>);
        expect(wrapper.find(TermLink).exists()).toBeTruthy();
    });

    it("merges multiple matches of one field of one asset into one result row", () => {
        const iri = Generator.generateUri();
        const vocabularyIri = Generator.generateUri();
        const results = [new SearchResult({
            iri,
            label: "Test",
            snippetText: "<em>Match</em> and another <em>match</em>",
            snippetField: "comment",
            vocabulary: {iri: vocabularyIri},
            types: [VocabularyUtils.TERM]
        }), new SearchResult({
            iri,
            label: "Test",
            snippetText: "<em>Match</em> and another <em>match</em>",
            snippetField: "comment",
            vocabulary: {iri: vocabularyIri},
            types: [VocabularyUtils.TERM]
        })];
        const wrapper = mountWithIntl(<MemoryRouter><SearchResults
            results={results} {...intlFunctions()}/></MemoryRouter>);
        const rows = wrapper.find("tr");
        // Header + result row
        expect(rows.length).toEqual(2);
        const label = wrapper.find(Link);
        expect(label.text()).toEqual(results[0].label);
    });

    it("merges multiple matches of one field of one asset into one result row", () => {
        const iri = Generator.generateUri();
        const vocabularyIri = Generator.generateUri();
        const results = [new SearchResult({
            iri,
            label: "Test",
            snippetText: "<em>Match</em> and another <em>match</em>",
            snippetField: "comment",
            vocabulary: {iri: vocabularyIri},
            types: [VocabularyUtils.TERM]
        }), new SearchResult({
            iri,
            label: "Test",
            snippetText: "<em>Match</em> and another <em>match</em>",
            snippetField: "comment",
            vocabulary: {iri: vocabularyIri},
            types: [VocabularyUtils.TERM]
        })];
        const wrapper = mountWithIntl(<MemoryRouter><SearchResults
            results={results} {...intlFunctions()}/></MemoryRouter>);
        const rows = wrapper.find("tr");
        // Header + result row
        expect(rows.length).toEqual(2);
        const label = wrapper.find(Link);
        expect(label.text()).toEqual(results[0].label);
        expect(wrapper.find(".search-result-match").text()).toContain(removeMarkup(results[0].snippetText));
    });

    function removeMarkup(text: string) {
        const tmp = text.replace(/<em>/g, "");
        return tmp.replace(/<\/em>/g, "");
    }

    it("merges matches of multiple fields of one asset into one result row", () => {
        const iri = Generator.generateUri();
        const vocabularyIri = Generator.generateUri();
        const results = [new SearchResult({
            iri,
            label: "Test",
            snippetText: "<em>Match</em> in label",
            snippetField: "label",
            vocabulary: {iri: vocabularyIri},
            types: [VocabularyUtils.TERM]
        }), new SearchResult({
            iri,
            label: "Test",
            snippetText: "<em>Match</em> in comment",
            snippetField: "comment",
            vocabulary: {iri: vocabularyIri},
            types: [VocabularyUtils.TERM]
        })];
        const wrapper = mountWithIntl(<MemoryRouter><SearchResults
            results={results} {...intlFunctions()}/></MemoryRouter>);
        const rows = wrapper.find("tr");
        // Header + result row
        expect(rows.length).toEqual(2);
        const label = wrapper.find(Link);
        expect(label.text()).toEqual(results[0].label);
        const matchTextContent = wrapper.find(".search-result-match").text();
        expect(matchTextContent).toContain(removeMarkup(results[0].snippetText));
        expect(matchTextContent).toContain(removeMarkup(results[1].snippetText));
    });

    it("ensures results are sorted by score descending", () => {
        const results = [generateTermResult(1.1), generateVocabularyResult(2.5)];
        const wrapper = mountWithIntl(<MemoryRouter><SearchResults
            results={results} {...intlFunctions()}/></MemoryRouter>);
        const rows = wrapper.find(Link);
        expect(rows.at(0).text()).toEqual(results[1].label);
        expect(rows.at(1).text()).toEqual(results[0].label);
    });

    it("renders label match before other matches of the same asset", () => {
        const iri = Generator.generateUri();
        // Comment before label
        const results = [new SearchResult({
            iri,
            label: "Test",
            snippetText: "<em>Match</em> in comment",
            snippetField: "comment",
            types: [VocabularyUtils.VOCABULARY]
        }), new SearchResult({
            iri,
            label: "Test",
            snippetText: "<em>Match</em> in label",
            snippetField: "label",
            types: [VocabularyUtils.VOCABULARY]
        })];
        const wrapper = mountWithIntl(<MemoryRouter><SearchResults
            results={results} {...intlFunctions()}/></MemoryRouter>);
        const matchComponent = wrapper.find(FTSMatch);
        expect(matchComponent.prop("matches")).toEqual([results[1].snippetText, results[0].snippetText]);
        expect(matchComponent.prop("fields")).toEqual([results[1].snippetField, results[0].snippetField]);
    });
});
