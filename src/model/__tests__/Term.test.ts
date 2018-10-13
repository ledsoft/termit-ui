import OntologicalVocabulary from "../../util/VocabularyUtils";
import Term, {TermData} from "../Term";

describe('Term tests', () => {

    let termData : TermData;
    let term : {};

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
});
