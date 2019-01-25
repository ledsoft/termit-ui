import * as React from "react";
import {Link, MemoryRouter} from "react-router-dom";
import Term from "../../../model/Term";
import TermLink from "../TermLink";
import {mountWithIntl} from "../../../__tests__/environment/Environment";
import Vocabulary from "../../../model/Vocabulary";
import Generator from "../../../__tests__/environment/Generator";

describe("TermLink", () => {

    it("links to correct internal asset", () => {
        const vocFragment = "localVocabularyFragment";
        const vocNamespace = "http://test.org/";
        const vocabulary = new Vocabulary({
            label: "Test vocabulary",
            iri: vocNamespace + vocFragment
        });
        const termFragment = "localTermFragment";
        const term = new Term({
            label: "Test term",
            iri: `${vocabulary.iri}/pojem/${termFragment}`,
            vocabulary
        });

        const link = mountWithIntl(<MemoryRouter><TermLink term={term}/></MemoryRouter>).find(Link);
        expect(link.props().to).toEqual(`/vocabularies/${vocFragment}/terms/${termFragment}?namespace=${vocNamespace}`);
    });

    it("render outgoing link when term is missing vocabulary", () => {
        const term = new Term({
            iri: Generator.generateUri(),
            label: "Term without vocabulary"
        });
        const wrapper = mountWithIntl(<MemoryRouter><TermLink term={term}/></MemoryRouter>);
        expect(wrapper.find(Link).exists()).toBeFalsy();
        expect(wrapper.find("a").text()).toEqual("↱");
    });
});