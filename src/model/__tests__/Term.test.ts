import OntologicalVocabulary from "../../util/VocabularyUtils";
import Term, {TermData} from "../Term";
import Generator from "../../__tests__/environment/Generator";

describe('Term tests', () => {

    let termData: TermData;
    let term: {};

    beforeEach(() => {
        termData = {
            iri: "http://example.org/term1",
            label: "test term 1",
            types: ["http://example.org/type1", OntologicalVocabulary.TERM],
        };

        term = {
            iri: "http://example.org/term1",
            label: "test term 1",
            types: ["http://example.org/type1"],
        };
    });

    it('load a term', () => {
        expect(term).toEqual(new Term(termData));
    });

    it('symmetry of constructor vs. toJSONLD', () => {
        expect(termData).toEqual(new Term(termData).toTermData());
    });

    it('removes Term type from TermData in constructor', () => {
        const testTerm = new Term(termData);
        expect(testTerm.types!.length).toEqual(1);
        expect(testTerm.types!.indexOf(OntologicalVocabulary.TERM)).toEqual(-1);
    });

    it('adds Term type to JSON-LD', () => {
        const testTerm = new Term({
            iri: Generator.generateUri(),
            label: 'Test'
        });
        const result = testTerm.toJsonLd();
        expect(result.types).toBeDefined();
        expect(result.types!.length).toEqual(1);
        expect(result.types!.indexOf(OntologicalVocabulary.TERM)).not.toEqual(-1);
    });

    describe('get unmappedProperties', () => {
        it('returns map of unmapped properties with values in term', () => {
            const extraProperty = 'http://onto.fel.cvut.cz/ontologies/termit/extra-one';
            const data:TermData = {
                "iri": "http://data.iprpraha.cz/zdroj/slovnik/test-vocabulary/term/pojem-5",
                "label": "pojem 5",
                "sources": [
                    "https://kbss.felk.cvut.cz/web/kbss/dataset-descriptor-ontology"
                ]
            };
            const value = 'value]';
            data[extraProperty] = value;
            const testTerm = new Term(data);
            const result = testTerm.unmappedProperties;
            expect(result.has(extraProperty)).toBeTruthy();
            expect(result.get(extraProperty)).toEqual([value]);
            expect(result.size).toEqual(1);
        });

        it('returns map of unmapped properties with values containing multiple values per property', () => {
            const extraProperty = 'http://onto.fel.cvut.cz/ontologies/termit/extra-one';
            const data:TermData = {
                "iri": "http://data.iprpraha.cz/zdroj/slovnik/test-vocabulary/term/pojem-5",
                "label": "pojem 5",
                "sources": [
                    "https://kbss.felk.cvut.cz/web/kbss/dataset-descriptor-ontology"
                ]
            };
            const values = ['v1', 'v2', 'v3'];
            data[extraProperty] = values;
            const testTerm = new Term(data);
            const result = testTerm.unmappedProperties;
            expect(result.has(extraProperty)).toBeTruthy();
            expect(result.get(extraProperty)).toEqual(values);
        });
    });

    describe('set unmappedProperties', () => {
        it('merges specified properties into the object state', () => {
            const testTerm = new Term(termData);
            const unmappedProps = new Map<string, string[]>();
            const extraProperty = 'http://onto.fel.cvut.cz/ontologies/termit/extra-one';
            const value = ['1', '2'];
            unmappedProps.set(extraProperty, value);
            testTerm.unmappedProperties = unmappedProps;
            expect(testTerm[extraProperty]).toBeDefined();
            expect(testTerm[extraProperty]).toEqual(value);
        });

        it('is symmetric to getter', () => {
            const testTerm = new Term(termData);
            const unmappedProps = new Map<string, string[]>();
            const extraProperty = 'http://onto.fel.cvut.cz/ontologies/termit/extra-one';
            const value = ['1', '2'];
            unmappedProps.set(extraProperty, value);
            testTerm.unmappedProperties = unmappedProps;
            expect(testTerm.unmappedProperties).toEqual(unmappedProps);
        });
    });
});
