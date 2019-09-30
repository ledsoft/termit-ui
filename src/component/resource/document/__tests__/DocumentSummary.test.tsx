import * as React from "react";
import Document from "../../../../model/Document";
import Generator from "../../../../__tests__/environment/Generator";
import {intlDataForShallow, mountWithIntl} from "../../../../__tests__/environment/Environment";
import {intlFunctions} from "../../../../__tests__/environment/IntlUtil";
import File from "../../../../model/File";
import VocabularyUtils, {IRI} from "../../../../util/VocabularyUtils";
import Resource from "../../../../model/Resource";
import {DocumentSummary} from "../DocumentSummary";
import AssetIriLink from "../../../misc/AssteIriLink";
import {MemoryRouter} from "react-router";
import {shallow} from "enzyme";

describe("DocumentSummary", () => {

    const namespace = "http://onto.fel.cvut.cz/ontologies/termit/resources/";
    const resourceName = "test-document";

    let loadResource: (iri: IRI) => Promise<any>;
    let saveResource: (resource: Resource) => Promise<any>;
    let removeResource: (resource: Resource) => Promise<any>;

    let resourceHandlers: any;

    let doc: Document;

    beforeEach(() => {
        loadResource = jest.fn().mockImplementation(() => Promise.resolve());
        saveResource = jest.fn().mockImplementation(() => Promise.resolve());
        removeResource = jest.fn().mockImplementation(() => Promise.resolve());
        resourceHandlers = {
            loadResource,
            saveResource,
            removeResource
        };
        doc = new Document({
            iri: namespace + resourceName,
            label: resourceName,
            files: [],
            types: [VocabularyUtils.DOCUMENT, VocabularyUtils.RESOURCE]
        });
    });

    it("does not render remove button for Document related to Vocabulary", () => {
        doc.vocabulary = {iri: Generator.generateUri()};
        const wrapper = mountWithIntl(<MemoryRouter><DocumentSummary
            resource={doc} {...resourceHandlers} {...intlFunctions()}/></MemoryRouter>);
        expect(wrapper.exists("button#resource-detail-remove")).toBeFalsy();
    });

    it("does not render remove button for Document containing files", () => {
        doc.files = [new File({iri: Generator.generateUri(), label: "test.html"})];
        const wrapper = mountWithIntl(<MemoryRouter><DocumentSummary
            resource={doc} {...resourceHandlers} {...intlFunctions()}/></MemoryRouter>);
        expect(wrapper.exists("button#resource-detail-remove")).toBeFalsy();
    });

    it("renders vocabulary link when Document has related Vocabulary", () => {
        doc.vocabulary = {iri: Generator.generateUri()};
        const wrapper = mountWithIntl(<MemoryRouter><DocumentSummary
            resource={doc} {...resourceHandlers} {...intlFunctions()}/></MemoryRouter>);
        expect(wrapper.exists(AssetIriLink)).toBeTruthy();
    });

    it("reloads document when file was added into it", () => {
        const wrapper = shallow<DocumentSummary>(<DocumentSummary
            resource={doc} {...resourceHandlers} {...intlFunctions()} {...intlDataForShallow()}/>);
        wrapper.instance().onFileAdded();
        expect(loadResource).toHaveBeenCalledWith(VocabularyUtils.create(doc.iri));
    });
});