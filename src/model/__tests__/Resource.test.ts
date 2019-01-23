import Resource, {ResourceData} from "../Resource";
import Generator from "../../__tests__/environment/Generator";
import VocabularyUtils from "../../util/VocabularyUtils";
import User from "../User";

describe("Resource", () => {
    describe("constructor", () => {
        it("adds Resource type to types when it is not present", () => {
            const data: ResourceData = {
                iri: Generator.generateUri(),
                label: "test"
            };
            const result = new Resource(data);
            expect(result.types).toBeDefined();
            expect(result.types!.indexOf(VocabularyUtils.RESOURCE)).not.toEqual(-1);
        });

        it("initializes author and last editor information when available", () => {
            const data: ResourceData = {
                iri: Generator.generateUri(),
                label: "test",
                author: {
                    iri: Generator.generateUri(),
                    firstName: "test",
                    lastName: "test-lastname",
                    username: "username"
                },
                lastEditor: {
                    iri: Generator.generateUri(),
                    firstName: "test2",
                    lastName: "test2-lastname",
                    username: "username2"
                }
            };
            const instance = new Resource(data);
            expect(instance.author instanceof User).toBeTruthy();
            expect(instance.lastEditor instanceof User).toBeTruthy();
        });
    });
});