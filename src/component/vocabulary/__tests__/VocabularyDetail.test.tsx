import * as React from "react";
import {VocabularyDetail} from "../VocabularyDetail";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import {shallow} from "enzyme";
import Vocabulary, {EMPTY_VOCABULARY} from "../../../model/Vocabulary";
import {createMemoryHistory} from "history";
import VocabularyUtils, {IRI} from "../../../util/VocabularyUtils";


describe("VocabularyDetail", () => {

    const normalizedName = "test-vocabulary";
    const namespace = VocabularyUtils.VOCABULARY + "/";

    const location = {
        pathname: "/vocabulary/" + normalizedName + "/term",
        search: "?namespace=" + namespace,
        hash: "",
        state: {}
    };
    const history = createMemoryHistory();
    const match = {
        params: {
            name: normalizedName
        },
        path: location.pathname,
        isExact: true,
        url: "http://localhost:3000" + location.pathname
    };

    let loadVocabulary: (vocabulary: IRI) => void;
    let loadTypes: (lang: string) => void;

    beforeEach(() => {
        loadVocabulary = jest.fn();
        loadTypes = jest.fn();
    });

    it("loads vocabulary on mount", () => {
        shallow(<VocabularyDetail vocabulary={EMPTY_VOCABULARY} loadVocabulary={loadVocabulary}
                                  loadTypes={loadTypes} lang="en" history={history} location={location}
                                  match={match} {...intlFunctions()}/>);
        expect(loadVocabulary).toHaveBeenCalled();
        expect((loadVocabulary as jest.Mock).mock.calls[0][0].fragment).toEqual(normalizedName);
    });

    it("does not load vocabulary on mount when correct one is already provided", () => {
        const vocabulary = new Vocabulary({
            iri: "http://onto.fel.cvut.cz/ontologies/termit/vocabularies/" + normalizedName,
            label: "Metropolitan plan"
        });
        shallow(<VocabularyDetail vocabulary={vocabulary} loadVocabulary={loadVocabulary}
                                  loadTypes={loadTypes} lang="en" history={history} location={location}
                                  match={match} {...intlFunctions()}/>);
        expect(loadVocabulary).not.toHaveBeenCalled();
    });

    it("uses namespace from location when loading vocabulary", () => {
        shallow(<VocabularyDetail vocabulary={EMPTY_VOCABULARY} loadVocabulary={loadVocabulary}
                                  loadTypes={loadTypes} lang="en" history={history} location={location}
                                  match={match} {...intlFunctions()}/>);
        expect((loadVocabulary as jest.Mock).mock.calls[0][0].namespace).toEqual(namespace);
    });
});
