import * as React from "react";
import VocabularyUtils, {IRI} from "../../../util/VocabularyUtils";
import {shallow} from "enzyme";
import {ResourceSummary} from "../ResourceSummary";
import Resource from "../../../model/Resource";
import Document from "../../../model/Document";
import File from "../../../model/File";
import {intlDataForShallow, mountWithIntl} from "../../../__tests__/environment/Environment";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import Generator from "../../../__tests__/environment/Generator";

describe("ResourceSummary", () => {

    const namespace = "http://onto.fel.cvut.cz/ontologies/termit/resources/";
    const resourceName = "test-resource";

    let loadResource: (iri: IRI) => Promise<any>;
    let saveResource: (resource: Resource) => Promise<any>;
    let removeResource: (resource: Resource) => Promise<any>;

    let resourceHandlers: any;

    beforeEach(() => {
        loadResource = jest.fn().mockImplementation(() => Promise.resolve());
        saveResource = jest.fn().mockImplementation(() => Promise.resolve());
        removeResource = jest.fn().mockImplementation(() => Promise.resolve());
        resourceHandlers = {
            loadResource,
            saveResource,
            removeResource
        };
    });

    it("invokes remove action and closes remove confirmation dialog on remove", () => {
        const resource = new Resource({
            iri: namespace + resourceName,
            label: resourceName
        });
        const wrapper = shallow<ResourceSummary>(<ResourceSummary
            resource={resource} {...resourceHandlers} {...intlFunctions()} {...intlDataForShallow()}
        />);
        wrapper.instance().onRemove();
        expect(removeResource).toHaveBeenCalledWith(resource);
        expect(wrapper.state("showRemoveDialog")).toBeFalsy();
    });

    it("does not render remove button for Document related to Vocabulary", () => {
        const doc = new Document({
            iri: namespace + resourceName,
            label: resourceName,
            files: [],
            vocabulary: {iri: Generator.generateUri()}
        });
        const wrapper = mountWithIntl(<ResourceSummary resource={doc} {...resourceHandlers} {...intlFunctions()}
        />);
        expect(wrapper.exists("button#resource-detail-remove")).toBeFalsy();
    });

    it("does not render remove button for Document containing files", () => {
        const doc = new Document({
            iri: namespace + resourceName,
            label: resourceName,
            files: [new File({iri: Generator.generateUri(), label: "test.html"})]
        });
        const wrapper = mountWithIntl(<ResourceSummary resource={doc} {...resourceHandlers} {...intlFunctions()}
        />);
        expect(wrapper.exists("button#resource-detail-remove")).toBeFalsy();
    });

    it("reloads resource after successful save", () => {
        const resource = new Resource({
            iri: namespace + resourceName,
            label: resourceName
        });
        const wrapper = shallow<ResourceSummary>(<ResourceSummary
            resource={resource} {...resourceHandlers} {...intlFunctions()} {...intlDataForShallow()}
        />);
        wrapper.instance().onSave(resource);
        return Promise.resolve().then(() => {
            expect(loadResource).toHaveBeenCalledWith(VocabularyUtils.create(resource.iri));
        });
    });
});