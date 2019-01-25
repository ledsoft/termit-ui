/**
 * Vocabulary used by the application ontological model.
 */
import {IRI, default as Vocabulary} from "../VocabularyUtils";

describe('Vocabulary', () => {

    it('Get Fragment slash', () => {
        expect(Vocabulary.getFragment("http://test.org/x/y")).toEqual("y");
    });
    it('Get Fragment hash', () => {
        expect(Vocabulary.getFragment("http://test.org/x#y")).toEqual("y");
    });
    it('Create IRI', () => {
        const iri :IRI = Vocabulary.create("http://test.org/x/y");
        expect(iri.fragment).toEqual("y");
        expect(iri.namespace).toEqual("http://test.org/x/");
    });
});