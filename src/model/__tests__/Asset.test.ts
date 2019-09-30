import Term from "../Term";
import Generator from "../../__tests__/environment/Generator";
import VocabularyUtils from "../../util/VocabularyUtils";
import Resource from "../Resource";

describe("Asset", () => {

    describe("get lastEdited", () => {
        it("returns last modified date when it exists", () => {
            const lastEdited = Date.now() - 1000;
            const asset = new Term({
                iri: Generator.generateUri(),
                label: "Test",
                created: Date.now() - 10000,
                lastModified: lastEdited
            });
            expect(asset.lastEdited).toEqual(lastEdited);
        });

        it("returns created date when last modified is not set", () => {
            const lastEdited = Date.now() - 1000;
            const asset = new Term({iri: Generator.generateUri(), label: "Test", created: lastEdited});
            expect(asset.lastEdited).toEqual(lastEdited);
        });
    });

    describe("get lastEditedBy", () => {
        it("returns last editor when it is set", () => {
            const asset = new Term({
                iri: Generator.generateUri(),
                label: "Test",
                created: Date.now() - 10000,
                lastModified: Date.now(),
                lastEditor: Generator.generateUser(),
                author: Generator.generateUser()
            });
            expect(asset.lastEditedBy).toEqual(asset.lastEditor);
        });

        it("returns author when last editor is not set", () => {
            const asset = new Term({
                iri: Generator.generateUri(),
                label: "Test",
                created: Date.now() - 10000,
                author: Generator.generateUser()
            });
            expect(asset.lastEditedBy).toEqual(asset.author);
        });
    });

    describe("addType", () => {
        it("initializes types with the specified type when they were undefined", () => {
            const asset = new Resource({
                iri: Generator.generateUri(),
                label: "Test"
            });
            asset.types = undefined;
            asset.addType(VocabularyUtils.DATASET);
            expect(asset.types).toBeDefined();
            expect(asset.types).toEqual([VocabularyUtils.DATASET]);
        });

        it("adds specified type to existing asset types", () => {
            const asset = new Resource({
                iri: Generator.generateUri(),
                label: "Test"
            });
            asset.addType(VocabularyUtils.DATASET);
            expect(asset.types).toBeDefined();
            expect(asset.types!.indexOf(VocabularyUtils.DATASET)).not.toEqual(-1);
        });

        it("does not add specified type when it is already present in the types attribute", () => {
            const asset = new Resource({
                iri: Generator.generateUri(),
                label: "Test"
            });
            expect(asset.types!.indexOf(VocabularyUtils.RESOURCE)).not.toEqual(-1);
            const origLength = asset.types!.length;
            asset.addType(VocabularyUtils.RESOURCE);
            expect(asset.types!.length).toEqual(origLength);
        });
    });
});