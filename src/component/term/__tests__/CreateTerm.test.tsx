import * as React from "react";
import VocabularyUtils, {IRI} from "../../../util/VocabularyUtils";
import Term from "../../../model/Term";
import {shallow} from "enzyme";
import {CreateTerm} from "../CreateTerm";
import Vocabulary from "../../../model/Vocabulary";
import Generator from "../../../__tests__/environment/Generator";
import Routing from "../../../util/Routing";
import Routes from "../../../util/Routes";

jest.mock("../../../util/Routing");

describe("CreateTerm", () => {

    const namespace = "http://onto.fel.cvut.cz/ontologies/termit/vocabularies/";
    const iri = "http://localhost:8080/termit/rest/vocabularies/test-vocabulary/terms/test-term?namespace=" + encodeURI(namespace);

    let onCreate: (term: Term, iri: IRI) => Promise<string>;
    let vocabulary: Vocabulary;
    let term: Term;

    beforeEach(() => {
        onCreate = jest.fn().mockImplementation(() => Promise.resolve(iri));
        vocabulary = new Vocabulary({
            iri: "http://onto.fel.cvut.cz/ontologies/termit/vocabularies/test-vocabulary",
            label: "test vocabulary"
        });
        term = new Term({
            iri: Generator.generateUri(),
            label: "test term"
        });
    });

    it("invokes on create on create call", () => {
        const wrapper = shallow(<CreateTerm createTerm={onCreate} vocabulary={vocabulary}/>);
        (wrapper.instance() as CreateTerm).onCreate(term);
        expect(onCreate).toHaveBeenCalledWith(term, VocabularyUtils.create(vocabulary.iri));
    });

    it("invokes transition to term detail on successful creation", () => {
        const wrapper = shallow(<CreateTerm createTerm={onCreate} vocabulary={vocabulary}/>);
        (wrapper.instance() as CreateTerm).onCreate(term);
        return Promise.resolve().then(() => {
            expect(Routing.transitionTo).toHaveBeenCalled();
            const call = (Routing.transitionTo as jest.Mock).mock.calls[0];
            expect(call[0]).toEqual(Routes.vocabularyDetail);
            expect((call[1].params as Map<string, string>).get("name")).toEqual("test-vocabulary");
            expect((call[1].params as Map<string, string>).get("termName")).toEqual("test-term");
            expect((call[1].query as Map<string, string>).get("namespace")).toEqual("http://onto.fel.cvut.cz/ontologies/termit/vocabularies/");
        });
    });
});