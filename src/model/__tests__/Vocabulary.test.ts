import Vocabulary, {VocabularyData} from "../Vocabulary";
import VocabularyUtils from "../../util/VocabularyUtils";
import Generator from "../../__tests__/environment/Generator";
import User from "../User";

describe("Vocabulary", () => {

    let data: VocabularyData;

    beforeEach(() => {
        data = {
            "iri": "http://data.iprpraha.cz/zdroj/slovnik/test-vocabulary/vocabularies/metropolitan-plan",
            "label": "Metropolitan plan",
            created: Date.now()
        };
    });

    describe("constructor", () => {
        it("adds vocabulary type when it is missing", () => {
            const testVocabulary = new Vocabulary(data);
            expect(testVocabulary.types).toBeDefined();
            expect(testVocabulary.types!.indexOf(VocabularyUtils.VOCABULARY)).not.toEqual(-1);
        });

        it("does not add vocabulary type when it is already present", () => {
            data.types = [VocabularyUtils.VOCABULARY];
            const testVocabulary = new Vocabulary(data);
            expect(testVocabulary.types).toBeDefined();
            expect(testVocabulary.types!.indexOf(VocabularyUtils.VOCABULARY)).not.toEqual(-1);
            expect(testVocabulary.types!.lastIndexOf(VocabularyUtils.VOCABULARY)).toEqual(testVocabulary.types!.indexOf(VocabularyUtils.VOCABULARY));
        });

        it("initializes author and last editor information when available", () => {
            data.author = {
                iri: Generator.generateUri(),
                firstName: "test",
                lastName: "test-lastname",
                username: "username"
            };
            data.lastEditor = {
                iri: Generator.generateUri(),
                firstName: "test2",
                lastName: "test2-lastname",
                username: "username2"
            };
            const instance = new Vocabulary(data);
            expect(instance.author instanceof User).toBeTruthy();
            expect(instance.lastEditor instanceof User).toBeTruthy();
        });
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

        it("deletes unmapped property if it is not present in updated map", () => {
            const extraProperty = Generator.generateUri();
            data[extraProperty] = "test";
            const testVocabulary = new Vocabulary(data);
            const newProperty = Generator.generateUri();
            testVocabulary.unmappedProperties = new Map([[newProperty, ["test1"]]]);
            expect(testVocabulary[newProperty]).toEqual(["test1"]);
            expect(testVocabulary[extraProperty]).not.toBeDefined();
        });
    });

    describe("toJsonLd", () => {

        it("correctly interprets author", () => {
            data.author = {
                iri: Generator.generateUri(),
                firstName: "Test",
                lastName: "Test Surname",
                username: "test@test",
                types: [VocabularyUtils.USER]
            };
            data.types = [VocabularyUtils.VOCABULARY];
            const testVocabulary = new Vocabulary(data);
            const jsonLd = testVocabulary.toJsonLd();
            expect(jsonLd.author).toEqual(data.author);
        });
    });
});