import * as React from "react";
import Resource from "../../../model/Resource";
import Ajax from "../../../util/Ajax";
import {mountWithIntl} from "../../../__tests__/environment/Environment";
import {CreateFileMetadata} from "../CreateFileMetadata";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";

jest.mock("../../../util/Ajax", () => ({
    default: jest.fn(),
    content: require.requireActual("../../../util/Ajax").content,
    params: require.requireActual("../../../util/Ajax").params,
    param: require.requireActual("../../../util/Ajax").param,
    accept: require.requireActual("../../../util/Ajax").accept,
}));

describe("CreateFileMetadata", () => {

    const iri = "http://onto.fel.cvut.cz/ontologies/termit/resource/test";

    let onCreate: (data: Resource) => void;
    let onCancel: () => void;

    beforeEach(() => {
        Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(iri));
        onCreate = jest.fn();
        onCancel = jest.fn();
    });

    it("uses name of the selected file as label", () => {
        const wrapper = mountWithIntl(<CreateFileMetadata onCreate={onCreate}
                                                          onCancel={onCancel} {...intlFunctions()}/>);
        const fileName = "test.html";
        const blob = new Blob([""], {type: "text/html"});
        // @ts-ignore
        blob["name"] = fileName;
        (wrapper.find(CreateFileMetadata).instance() as CreateFileMetadata).onFileSelected([blob as File]);
        const labelInput = wrapper.find("input[name=\"create-resource-label\"]");
        expect((labelInput.getDOMNode() as HTMLInputElement).value).toEqual(fileName);
    });

    it("generates identifier after label has been set based on selected file", () => {
        const wrapper = mountWithIntl(<CreateFileMetadata onCreate={onCreate}
                                                          onCancel={onCancel} {...intlFunctions()}/>);
        const fileName = "test.html";
        const blob = new Blob([""], {type: "text/html"});
        // @ts-ignore
        blob["name"] = fileName;
        (wrapper.find(CreateFileMetadata).instance() as CreateFileMetadata).onFileSelected([blob as File]);
        expect(Ajax.get).toHaveBeenCalled();
        return Promise.resolve().then(() => {
            const iriInput = wrapper.find("input[name=\"create-resource-iri\"]");
            expect((iriInput.getDOMNode() as HTMLInputElement).value).toEqual(iri);
        })
    })
});