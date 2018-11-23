import Generator from "../../__tests__/environment/Generator";
import RdfsResource, {CONTEXT, RdfsResourceData} from "../RdfsResource";

describe("RdfsResource", () => {

    it("constructor is symmetrical to toJsonLd", () => {
        const data: RdfsResourceData = {
            iri: Generator.generateUri(),
            label: "Test",
            comment: "Description"
        };
        Object.assign(data, {"@context": CONTEXT});
        const resource = new RdfsResource(data);
        expect(resource.toJsonLd()).toEqual(data);
    });
});