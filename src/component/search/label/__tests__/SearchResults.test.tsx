import * as React from "react";
import {mountWithIntl} from "../../../../__tests__/environment/Environment";
import {SearchResults} from "../SearchResults";
import {intlFunctions} from "../../../../__tests__/environment/IntlUtil";
import {Button, Label} from "reactstrap";
import en from "../../../../i18n/en";
import SearchResult from "../../../../model/SearchResult";
import Generator from "../../../../__tests__/environment/Generator";
import VocabularyUtils from "../../../../util/VocabularyUtils";
import TermBadge from "../../../badge/TermBadge";
import VocabularyBadge from "../../../badge/VocabularyBadge";
import Routing from "../../../../util/Routing";
import Routes from "../../../../util/Routes";
import {FTSMatch} from "../FTSMatch";
import {Link} from "react-router-dom";

jest.mock("../../../../util/Routing");

describe("SearchResults", () => {

    afterEach(() => {
        jest.resetAllMocks();
    });

    it("render no results info when no results are found", () => {
        const wrapper = mountWithIntl(<SearchResults results={[]} {...intlFunctions()}/>);
        const label = wrapper.find(Label);
        expect(label.exists()).toBeTruthy();
        expect(label.text()).toContain(en.messages["main.search.no-results"]);
    });

    it("renders term results", () => {
        const result = new SearchResult({
            iri: Generator.generateUri(),
            label: "Test",
            snippetText: "<em>Match</em>",
            snippetField: "label",
            types: [VocabularyUtils.TERM]
        });
        const wrapper = mountWithIntl(<SearchResults results={[result]} {...intlFunctions()}/>);
        const rows = wrapper.find("tr");
        // Header + result row
        expect(rows.length).toEqual(2);
        expect(rows.find(TermBadge).exists()).toBeTruthy();
        const label = wrapper.find(Link);
        expect(label.text()).toEqual(result.label);
    });

    it("renders vocabulary results", () => {
        const result = new SearchResult({
            iri: Generator.generateUri(),
            label: "Test",
            snippetText: "<em>Match</em>",
            snippetField: "label",
            types: [VocabularyUtils.VOCABULARY]
        });
        const wrapper = mountWithIntl(<SearchResults results={[result]} {...intlFunctions()}/>);
        const rows = wrapper.find("tr");
        // Header + result row
        expect(rows.length).toEqual(2);
        expect(rows.find(VocabularyBadge).exists()).toBeTruthy();
        const label = wrapper.find(Link);
        expect(label.text()).toEqual(result.label);
    });

    it("renders both vocabulary and term results", () => {
        const results = [new SearchResult({
            iri: Generator.generateUri(),
            label: "Test term",
            snippetText: "<em>Match</em>",
            snippetField: "label",
            types: [VocabularyUtils.TERM]
        }), new SearchResult({
            iri: Generator.generateUri(),
            label: "Test vocabulary",
            snippetText: "<em>Match</em>",
            snippetField: "label",
            types: [VocabularyUtils.VOCABULARY]
        })];
        const wrapper = mountWithIntl(<SearchResults results={results} {...intlFunctions()}/>);
        const rows = wrapper.find("tr");
        // Header + result row
        expect(rows.length).toEqual(3);
        expect(rows.find(TermBadge).length).toEqual(1);
        expect(rows.find(VocabularyBadge).length).toEqual(1);
    });

    it("transitions to vocabulary detail when vocabulary result label is clicked", () => {
        const normalizedName = "test-vocabulary";
        const namespace = "http://onto.fel.cvut.cz/ontologies/termit/vocabularies/";
        const result = new SearchResult({
            iri: namespace + normalizedName,
            label: "Test",
            snippetText: "<em>Match</em>",
            snippetField: "label",
            types: [VocabularyUtils.VOCABULARY]
        });
        const wrapper = mountWithIntl(<SearchResults results={[result]} {...intlFunctions()}/>);
        wrapper.find(Button).simulate("click");
        expect(Routing.transitionTo).toHaveBeenCalled();
        const call = (Routing.transitionTo as jest.Mock).mock.calls[0];
        expect(call[0]).toEqual(Routes.vocabularySummary);
        expect((call[1].params as Map<string, string>).get("name")).toEqual(normalizedName);
        expect((call[1].query as Map<string, string>).get("namespace")).toEqual(namespace);
    });

    it("transitions to term detail when term result label is clicked", () => {
        const normalizedName = "test-term";
        const normalizedVocabularyName = "test-vocabulary";
        const namespace = "http://onto.fel.cvut.cz/ontologies/termit/vocabularies/";
        const result = new SearchResult({
            iri: namespace + normalizedVocabularyName + "/terms/" + normalizedName,
            label: "Test",
            snippetText: "<em>Match</em>",
            snippetField: "label",
            vocabulary: {iri: namespace + normalizedVocabularyName},
            types: [VocabularyUtils.TERM]
        });
        const wrapper = mountWithIntl(<SearchResults results={[result]} {...intlFunctions()}/>);
        wrapper.find(Button).simulate("click");
        expect(Routing.transitionTo).toHaveBeenCalled();
        const call = (Routing.transitionTo as jest.Mock).mock.calls[0];
        expect(call[0]).toEqual(Routes.vocabularyTermDetail);
        expect((call[1].params as Map<string, string>).get("name")).toEqual(normalizedVocabularyName);
        expect((call[1].params as Map<string, string>).get("termName")).toEqual(normalizedName);
        expect((call[1].query as Map<string, string>).get("namespace")).toEqual(namespace);
    });

    it("merges multiple matches of one field of one asset into one result row", () => {
        const iri = Generator.generateUri();
        const results = [new SearchResult({
            iri,
            label: "Test",
            snippetText: "<em>Match</em> and another <em>match</em>",
            snippetField: "comment",
            types: [VocabularyUtils.TERM]
        }), new SearchResult({
            iri,
            label: "Test",
            snippetText: "<em>Match</em> and another <em>match</em>",
            snippetField: "comment",
            types: [VocabularyUtils.TERM]
        })];
        const wrapper = mountWithIntl(<SearchResults results={results} {...intlFunctions()}/>);
        const rows = wrapper.find("tr");
        // Header + result row
        expect(rows.length).toEqual(2);
        const label = wrapper.find(Button);
        expect(label.text()).toEqual(results[0].label);
    });

    it("merges multiple matches of one field of one asset into one result row", () => {
        const iri = Generator.generateUri();
        const results = [new SearchResult({
            iri,
            label: "Test",
            snippetText: "<em>Match</em> and another <em>match</em>",
            snippetField: "comment",
            types: [VocabularyUtils.TERM]
        }), new SearchResult({
            iri,
            label: "Test",
            snippetText: "<em>Match</em> and another <em>match</em>",
            snippetField: "comment",
            types: [VocabularyUtils.TERM]
        })];
        const wrapper = mountWithIntl(<SearchResults results={results} {...intlFunctions()}/>);
        const rows = wrapper.find("tr");
        // Header + result row
        expect(rows.length).toEqual(2);
        const label = wrapper.find(Button);
        expect(label.text()).toEqual(results[0].label);
        expect(wrapper.find(".search-result-match").text()).toContain(removeMarkup(results[0].snippetText));
    });

    function removeMarkup(text: string) {
        const tmp = text.replace(/<em>/g, "");
        return tmp.replace(/<\/em>/g, "");
    }

    it("merges matches of multiple fields of one asset into one result row", () => {
        const iri = Generator.generateUri();
        const results = [new SearchResult({
            iri,
            label: "Test",
            snippetText: "<em>Match</em> in label",
            snippetField: "label",
            types: [VocabularyUtils.TERM]
        }), new SearchResult({
            iri,
            label: "Test",
            snippetText: "<em>Match</em> in comment",
            snippetField: "comment",
            types: [VocabularyUtils.TERM]
        })];
        const wrapper = mountWithIntl(<SearchResults results={results} {...intlFunctions()}/>);
        const rows = wrapper.find("tr");
        // Header + result row
        expect(rows.length).toEqual(2);
        const label = wrapper.find(Button);
        expect(label.text()).toEqual(results[0].label);
        const matchTextContent = wrapper.find(".search-result-match").text();
        expect(matchTextContent).toContain(removeMarkup(results[0].snippetText));
        expect(matchTextContent).toContain(removeMarkup(results[1].snippetText));
    });

    it("ensures results are sorted by score descending", () => {
        const results = [new SearchResult({
            iri: Generator.generateUri(),
            label: "Test term",
            snippetText: "<em>Match</em>",
            snippetField: "label",
            score: 1.1,
            types: [VocabularyUtils.TERM]
        }), new SearchResult({
            iri: Generator.generateUri(),
            label: "Test vocabulary",
            snippetText: "<em>Match</em>",
            snippetField: "label",
            score: 2.5,
            types: [VocabularyUtils.VOCABULARY]
        })];
        const wrapper = mountWithIntl(<SearchResults results={results} {...intlFunctions()}/>);
        const rows = wrapper.find("button.search-result-assetlink");
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
            types: [VocabularyUtils.TERM]
        }), new SearchResult({
            iri,
            label: "Test",
            snippetText: "<em>Match</em> in label",
            snippetField: "label",
            types: [VocabularyUtils.TERM]
        })];
        const wrapper = mountWithIntl(<SearchResults results={results} {...intlFunctions()}/>);
        const matchComponent = wrapper.find(FTSMatch);
        expect(matchComponent.prop("matches")).toEqual([results[1].snippetText, results[0].snippetText]);
        expect(matchComponent.prop("fields")).toEqual([results[1].snippetField, results[0].snippetField]);
    });
});
