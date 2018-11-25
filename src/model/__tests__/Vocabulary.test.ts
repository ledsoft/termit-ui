import Vocabulary, {VocabularyData} from "../Vocabulary";

describe("Vocabulary", () => {

    let data: VocabularyData;

    beforeEach(() => {
        data = {
            "iri": "http://data.iprpraha.cz/zdroj/slovnik/test-vocabulary/vocabularies/metropolitan-plan",
            "label": "Metropolitan plan",
            created: Date.now()
        };
    });

    describe('get unmappedProperties', () => {
        it('returns map of unmapped properties with values in vocabulary', () => {
            const extraProperty = 'http://onto.fel.cvut.cz/ontologies/termit/extra-one';
            const value = 'value]';
            data[extraProperty] = value;
            const testVocabulary = new Vocabulary(data);
            const result = testVocabulary.unmappedProperties;
            expect(result.has(extraProperty)).toBeTruthy();
            expect(result.get(extraProperty)).toEqual([value]);
            expect(result.size).toEqual(1);
        });

        it('returns map of unmapped properties with values containing multiple values per property', () => {
            const extraProperty = 'http://onto.fel.cvut.cz/ontologies/termit/extra-one';
            const values = ['v1', 'v2', 'v3'];
            data[extraProperty] = values;
            const testVocabulary = new Vocabulary(data);
            const result = testVocabulary.unmappedProperties;
            expect(result.has(extraProperty)).toBeTruthy();
            expect(result.get(extraProperty)).toEqual(values);
        });
    });

    describe('set unmappedProperties', () => {


        it('merges specified properties into the object state', () => {
            const testVocabulary = new Vocabulary(data);
            const unmappedProps = new Map<string, string[]>();
            const extraProperty = 'http://onto.fel.cvut.cz/ontologies/termit/extra-one';
            const value = ['1', '2'];
            unmappedProps.set(extraProperty, value);
            testVocabulary.unmappedProperties = unmappedProps;
            expect(testVocabulary[extraProperty]).toBeDefined();
            expect(testVocabulary[extraProperty]).toEqual(value);
        });

        it('is symmetric to getter', () => {
            const testVocabulary = new Vocabulary(data);
            const unmappedProps = new Map<string, string[]>();
            const extraProperty = 'http://onto.fel.cvut.cz/ontologies/termit/extra-one';
            const value = ['1', '2'];
            unmappedProps.set(extraProperty, value);
            testVocabulary.unmappedProperties = unmappedProps;
            expect(testVocabulary.unmappedProperties).toEqual(unmappedProps);
        });
    });
});