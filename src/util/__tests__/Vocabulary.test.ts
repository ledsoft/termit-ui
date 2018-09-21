/**
 * Vocabulary used by the application ontological model.
 */
import {IRI, default as Vocabulary} from "../Vocabulary";
import constants from "../Constants";

describe('Vocabulary', () => {

    it('Compare different IRIs, one without namespace', () => {
        const iri1 : IRI = {
            namespace : 'http://testiri.org/',
            fragment : 'fragment'
        }
        const iri2 : IRI = {
            fragment : 'fragment'
        }
        expect(Vocabulary.equal(iri1,iri2)).toBeFalsy();
    });

    it('Compare the same IRIs, one without namespace', () => {
        const iri1 : IRI = {
            namespace : constants.namespace_vocabulary,
            fragment : 'fragment'
        }
        const iri2 : IRI = {
            fragment : 'fragment'
        }
        expect(Vocabulary.equal(iri1,iri2)).toBeTruthy();
    });
    it('Resolve IRI with namespace', () => {
        const iri1 : IRI = {
            namespace : "http://test.org/",
            fragment : 'fragment'
        }
        expect(Vocabulary.resolve(iri1)).toEqual("http://test.org/fragment");
    });
    it('Resolve IRI without namespace', () => {
        const iri1 : IRI = {
            fragment : 'fragment'
        }
        expect(Vocabulary.resolve(iri1)).toEqual(constants.namespace_vocabulary+"fragment");
    });
    it('Get Fragment slash', () => {
        expect(Vocabulary.getFragment("http://test.org/x/y")).toEqual("y");
    });
    it('Get Fragment hash', () => {
        expect(Vocabulary.getFragment("http://test.org/x#y")).toEqual("y");
    });
});