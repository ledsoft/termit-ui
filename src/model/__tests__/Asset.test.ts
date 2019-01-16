import Term from "../Term";
import Generator from "../../__tests__/environment/Generator";

describe("Asset", () => {

    describe("get lastEdited", () => {
        it("returns last modified date when it exists", () => {
            const lastEdited = Date.now() - 1000;
            const asset = new Term({iri: Generator.generateUri(), label: "Test", created: Date.now() - 10000, lastModified: lastEdited});
            expect(asset.lastEdited).toEqual(lastEdited);
        });

        it("returns created date when last modified is not set", () => {
            const lastEdited = Date.now() - 1000;
            const asset = new Term({iri: Generator.generateUri(), label: "Test", created: lastEdited});
            expect(asset.lastEdited).toEqual(lastEdited);
        });
    });
});