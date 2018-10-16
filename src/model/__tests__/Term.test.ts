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
});
