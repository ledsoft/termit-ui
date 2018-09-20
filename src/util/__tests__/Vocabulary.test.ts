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
});