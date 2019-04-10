import VocabularyUtils from "../VocabularyUtils";
import JsonLdUtils from "../JsonLdUtils";
import {CONTEXT as VOCABULARY_CONTEXT} from "../../model/Vocabulary";
import {CONTEXT as TERM_CONTEXT} from "../../model/Term";

describe("JsonLdUtils", () => {

    describe("resolveReferences", () => {
        it("replaces reference node with a known instance in a singular property", () => {
            const data = {
                iri: "http://data",
                author: {
                    iri: "http://user",
                    firstName: "First name",
                    lastName: "lastName",
                    types: [VocabularyUtils.USER]
                },
                created: Date.now() - 10000,
                lastEditor: {
                    iri: "http://user"
                },
                lastModified: Date.now()
            };
            const result:any = JsonLdUtils.resolveReferences(data);
            expect(result.lastEditor).toEqual(data.author);
        });

        it("replaces reference node with a known instance in an array", () => {
            const data = {
                iri: "http://data",
                author: {
                    iri: "http://user",
                    firstName: "First name",
                    lastName: "lastName",
                    types: [VocabularyUtils.USER]
                },
                created: Date.now() - 10000,
                editors: [{
                    iri: "http://user"
                }, {
                    iri: "http://anotherUser",
                    firstName: "Another first name",
                    lastName: "Another last name",
                    types: [VocabularyUtils.USER]
                }],
                lastModified: Date.now()
            };
            const result:any = JsonLdUtils.resolveReferences(data);
            expect(result.editors[0]).toEqual(data.author);
        });
    });

    describe("compactAndResolveReferences", () => {
        it("compacts input JSON-LD using the context and resolves references", () => {
            const input = require("../../rest-mock/vocabulary");
            input[VocabularyUtils.HAS_LAST_EDITOR] = {
                "@id": "http://onto.fel.cvut.cz/ontologies/termit/user/catherine-halsey"
            };
            return JsonLdUtils.compactAndResolveReferences(input, VOCABULARY_CONTEXT).then((result:any) => {
                expect(result.author).toBeDefined();
                expect(result.lastEditor).toBeDefined();
                expect(result.lastEditor).toEqual(result.author);
            });
        });
    });

    describe("compactAndResolveReferencesAsArray", () => {
        it("returns array with items compacted from the specified JSON-LD", () => {
            const input = require("../../rest-mock/terms");
            input[0][VocabularyUtils.HAS_AUTHOR] = {
                "@id": "http://onto.fel.cvut.cz/ontologies/termit/user/test-author",
                "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/má-křestní-jméno": "Author",
                "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/má-příjmení": "Surname",
                "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/má-uživatelské-jméno": "username"
            };
            input[0][VocabularyUtils.HAS_LAST_EDITOR] = {
                "@id": "http://onto.fel.cvut.cz/ontologies/termit/user/test-author"
            };
            return JsonLdUtils.compactAndResolveReferencesAsArray(input, TERM_CONTEXT).then((result:any[]) => {
                expect(Array.isArray(result)).toBeTruthy();
                expect(result[0].author).toBeDefined();
                expect(result[0].lastEditor).toBeDefined();
                expect(result[0].lastEditor).toEqual(result[0].author);
            });
        });

        it("returns array with single item compacted from specified JSON-LD", () => {
            const input = [require("../../rest-mock/vocabulary")];
            input[0][VocabularyUtils.HAS_LAST_EDITOR] = {
                "@id": "http://onto.fel.cvut.cz/ontologies/termit/user/catherine-halsey"
            };
            return JsonLdUtils.compactAndResolveReferencesAsArray(input, VOCABULARY_CONTEXT).then((result:any[]) => {
                expect(Array.isArray(result)).toBeTruthy();
                expect(result.length).toEqual(1);
                expect(result[0].author).toBeDefined();
                expect(result[0].lastEditor).toBeDefined();
                expect(result[0].lastEditor).toEqual(result[0].author);
            });
        });
    });
});