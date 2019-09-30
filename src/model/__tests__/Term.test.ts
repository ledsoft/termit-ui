import OntologicalVocabulary from "../../util/VocabularyUtils";
import Term, {TermData} from "../Term";
import Generator from "../../__tests__/environment/Generator";
import User from "../User";

describe("Term tests", () => {

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
            types: ["http://example.org/type1", OntologicalVocabulary.TERM],
        };
    });

    it("load a term", () => {
        expect(term).toEqual(new Term(termData));
    });

    describe("constructor", () => {
        it("is symmetric to toJSONLD", () => {
            expect(termData).toEqual(new Term(termData).toTermData());
        });

        it("initializes author and last editor information when available", () => {
            termData.author = {
                iri: Generator.generateUri(),
                firstName: "test",
                lastName: "test-lastname",
                username: "username"
            };
            termData.lastEditor = {
                iri: Generator.generateUri(),
                firstName: "test2",
                lastName: "test2-lastname",
                username: "username2"
            };
            const instance = new Term(termData);
            expect(instance.author instanceof User).toBeTruthy();
            expect(instance.lastEditor instanceof User).toBeTruthy();
        });

        it("does not set parent when no parentTerms are available", () => {
            const result = new Term(termData);
            expect(result.parent).not.toBeDefined();
        });

        it("sets parent based on parentTerms", () => {
            termData.vocabulary = {iri: Generator.generateUri()};
            termData.parentTerms = [{
                iri: Generator.generateUri(),
                label: "Parent",
                vocabulary: termData.vocabulary
            }];
            const result = new Term(termData);
            expect(result.parent).toEqual(termData.parentTerms[0].iri);
        });

        it("sets parent to first parent with same vocabulary", () => {
            termData.vocabulary = {iri: Generator.generateUri()};
            termData.parentTerms = [{
                iri: Generator.generateUri(),
                label: "Parent",
                vocabulary: {iri: Generator.generateUri()}
            }, {
                iri: Generator.generateUri(),
                label: "Parent Two",
                vocabulary: {iri: termData.vocabulary.iri}
            }];
            const result = new Term(termData);
            expect(result.parent).toEqual(termData.parentTerms[1].iri);
        });

        it("sanitizes subTerms to an array in case it is a singular object", () => {
            const subTerm = {iri: Generator.generateUri(), label: "test", vocabulary: {iri: Generator.generateUri()}};
            Object.assign(termData, {subTerms: subTerm});
            const result = new Term(termData);
            expect(result.subTerms).toEqual([subTerm]);
        });
    });

    it("adds term type in constructor when it is missing in specified data", () => {
        const data = {
            iri: Generator.generateUri(),
            label: "New term"
        };
        const result = new Term(data);
        expect(result.types).toBeDefined();
        expect(result.types!.indexOf(OntologicalVocabulary.TERM)).not.toEqual(-1);
    });

    describe("get unmappedProperties", () => {
        it("returns map of unmapped properties with values in term", () => {
            const extraProperty = "http://onto.fel.cvut.cz/ontologies/termit/extra-one";
            const data: TermData = {
                "iri": "http://data.iprpraha.cz/zdroj/slovnik/test-vocabulary/term/pojem-5",
                "label": "pojem 5",
                "sources": [
                    "https://kbss.felk.cvut.cz/web/kbss/dataset-descriptor-ontology"
                ]
            };
            const value = "value]";
            data[extraProperty] = value;
            const testTerm = new Term(data);
            const result = testTerm.unmappedProperties;
            expect(result.has(extraProperty)).toBeTruthy();
            expect(result.get(extraProperty)).toEqual([value]);
            expect(result.size).toEqual(1);
        });

        it("returns map of unmapped properties with values containing multiple values per property", () => {
            const extraProperty = "http://onto.fel.cvut.cz/ontologies/termit/extra-one";
            const data: TermData = {
                "iri": "http://data.iprpraha.cz/zdroj/slovnik/test-vocabulary/term/pojem-5",
                "label": "pojem 5",
                "sources": [
                    "https://kbss.felk.cvut.cz/web/kbss/dataset-descriptor-ontology"
                ]
            };
            const values = ["v1", "v2", "v3"];
            data[extraProperty] = values;
            const testTerm = new Term(data);
            const result = testTerm.unmappedProperties;
            expect(result.has(extraProperty)).toBeTruthy();
            expect(result.get(extraProperty)).toEqual(values);
        });
    });

    describe("set unmappedProperties", () => {
        it("merges specified properties into the object state", () => {
            const testTerm = new Term(termData);
            const unmappedProps = new Map<string, string[]>();
            const extraProperty = "http://onto.fel.cvut.cz/ontologies/termit/extra-one";
            const value = ["1", "2"];
            unmappedProps.set(extraProperty, value);
            testTerm.unmappedProperties = unmappedProps;
            expect(testTerm[extraProperty]).toBeDefined();
            expect(testTerm[extraProperty]).toEqual(value);
        });

        it("is symmetric to getter", () => {
            const testTerm = new Term(termData);
            const unmappedProps = new Map<string, string[]>();
            const extraProperty = "http://onto.fel.cvut.cz/ontologies/termit/extra-one";
            const value = ["1", "2"];
            unmappedProps.set(extraProperty, value);
            testTerm.unmappedProperties = unmappedProps;
            expect(testTerm.unmappedProperties).toEqual(unmappedProps);
        });
    });

    describe("syncPlainSubTerms", () => {
        it("synchronizes plainSubTerms with current subTerms value", () => {
            const origSubTerms = [{
                iri: Generator.generateUri(),
                label: "test one",
                vocabulary: {iri: Generator.generateUri()}
            }, {
                iri: Generator.generateUri(),
                label: "test two",
                vocabulary: {iri: Generator.generateUri()}
            }];
            termData.subTerms = origSubTerms;
            const sut = new Term(termData);
            expect(sut.plainSubTerms).toEqual(origSubTerms.map(ti => ti.iri));
            const newSubTerms = origSubTerms.slice();
            newSubTerms.splice(newSubTerms.length - 1, 1);
            newSubTerms.push({
                iri: Generator.generateUri(),
                label: "test three",
                vocabulary: {iri: Generator.generateUri()}
            });
            sut.subTerms = newSubTerms;
            sut.syncPlainSubTerms();
            expect(sut.plainSubTerms).toEqual(newSubTerms.map(ti => ti.iri));
        });
    });

    it("is invoked by constructor", () => {
        const origSubTerms = [{
            iri: Generator.generateUri(),
            label: "test one",
            vocabulary: {iri: Generator.generateUri()}
        }];
        termData.subTerms = origSubTerms;
        const sut = new Term(termData);
        expect(sut.plainSubTerms).toEqual(origSubTerms.map(ti => ti.iri));
    });
});
