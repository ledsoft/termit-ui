import * as React from "react";
import Resource from "../../../model/Resource";
import Ajax from "../../../util/Ajax";
import {intlDataForShallow, mountWithIntl} from "../../../__tests__/environment/Environment";
import {CreateFileMetadata} from "../CreateFileMetadata";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import {shallow} from "enzyme";

jest.mock("../../../util/Ajax", () => ({
    default: jest.fn(),
    content: require.requireActual("../../../util/Ajax").content,
    params: require.requireActual("../../../util/Ajax").params,
    param: require.requireActual("../../../util/Ajax").param,
    accept: require.requireActual("../../../util/Ajax").accept,
}));

describe("CreateFileMetadata", () => {

    const fileName = "test.html";
    const iri = "http://onto.fel.cvut.cz/ontologies/termit/resource/" + fileName;

    let file: Blob;

    let onCreate: (data: Resource) => Promise<string>;
    let onCancel: () => void;
    let uploadFile: (fileIri: string, file: File) => void;

    beforeEach(() => {
        Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(iri));
        onCreate = jest.fn().mockImplementation(() => Promise.resolve(iri));
        onCancel = jest.fn();
        uploadFile = jest.fn();
        file = new Blob([""], {type: "text/html"});
        // @ts-ignore
        file["name"] = fileName;
    });

    it("uses name of the selected file as label", () => {
        const wrapper = mountWithIntl(<CreateFileMetadata onCreate={onCreate} onCancel={onCancel}
                                                          uploadFileContent={uploadFile} {...intlFunctions()}/>);
        (wrapper.find(CreateFileMetadata).instance() as CreateFileMetadata).onFileSelected([file as File]);
        const labelInput = wrapper.find("input[name=\"create-resource-label\"]");
        expect((labelInput.getDOMNode() as HTMLInputElement).value).toEqual(fileName);
    });

    it("generates identifier after label has been set based on selected file", () => {
        const wrapper = mountWithIntl(<CreateFileMetadata onCreate={onCreate} onCancel={onCancel}
                                                          uploadFileContent={uploadFile} {...intlFunctions()}/>);
        (wrapper.find(CreateFileMetadata).instance() as CreateFileMetadata).onFileSelected([file as File]);
        expect(Ajax.get).toHaveBeenCalled();
        return Promise.resolve().then(() => {
            const iriInput = wrapper.find("input[name=\"create-resource-iri\"]");
            expect((iriInput.getDOMNode() as HTMLInputElement).value).toEqual(iri);
        })
    });

    it("uploads file content on resource creation success", () => {
        const wrapper = shallow<CreateFileMetadata>(<CreateFileMetadata onCreate={onCreate} onCancel={onCancel}
                                                                        uploadFileContent={uploadFile} {...intlFunctions()} {...intlDataForShallow()}/>);
        wrapper.instance().onFileSelected([file as File]);
        wrapper.instance().onCreate();
        return Promise.resolve().then(() => {
            expect(uploadFile).toHaveBeenCalledWith(iri, file);
        });
    });

    it("does not attempt file upload when no file has been attached", () => {
        const wrapper = shallow<CreateFileMetadata>(<CreateFileMetadata onCreate={onCreate} onCancel={onCancel}
                                                                        uploadFileContent={uploadFile} {...intlFunctions()} {...intlDataForShallow()}/>);
        wrapper.instance().onCreate();
        return Promise.resolve().then(() => {
            expect(uploadFile).not.toHaveBeenCalled();
        });
    });
});