import * as React from "react";
import {Link, MemoryRouter} from "react-router-dom";
import Term from "../../../model/Term";
import TermLink from "../TermLink";
import {mountWithIntl} from "../../../__tests__/environment/Environment";
import Vocabulary from "../../../model/Vocabulary";

describe("Term Link links to correct internal asset", () => {

    it("link to an asset", () => {
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
});