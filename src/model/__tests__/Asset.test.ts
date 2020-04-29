import Generator from "../../__tests__/environment/Generator";
import VocabularyUtils from "../../util/VocabularyUtils";
import Resource from "../Resource";

describe("Asset", () => {
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
