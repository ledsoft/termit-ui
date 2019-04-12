import * as React from "react";
import Ajax from "../../../util/Ajax";
import {mountWithIntl} from "../../../__tests__/environment/Environment";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import Routing from "../../../util/Routing";
import Routes from "../../../util/Routes";
import Resource from "../../../model/Resource";
import {CreateResource} from "../CreateResource";
import VocabularyUtils from "../../../util/VocabularyUtils";
import {CreateFileMetadata} from "../CreateFileMetadata";
import {CreateResourceMetadata} from "../CreateResourceMetadata";

jest.mock("../../../util/Routing");
jest.mock("../../../util/Ajax", () => ({
    default: jest.fn(),
    content: require.requireActual("../../../util/Ajax").content,
    params: require.requireActual("../../../util/Ajax").params,
    param: require.requireActual("../../../util/Ajax").param,
    accept: require.requireActual("../../../util/Ajax").accept,
}));

describe("CreateResource", () => {
    const iri = "http://onto.fel.cvut.cz/ontologies/termit/resource/test";

    let onCreate: (resource: Resource) => void;

    beforeEach(() => {
        Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(iri));
        onCreate = jest.fn();
    });

    it("returns to Resource Management on cancel", () => {
        const wrapper = mountWithIntl(<CreateResource onCreate={onCreate} {...intlFunctions()}/>);
        wrapper.find("button#create-resource-cancel").simulate("click");
        expect(Routing.transitionTo).toHaveBeenCalledWith(Routes.resources);
    });

    it("onCreate is passed data with selected resource type", () => {
        const wrapper = mountWithIntl(<CreateResource onCreate={onCreate}  {...intlFunctions()}/>);
        const typeSelectButtons = wrapper.find("button.create-resource-type-select");
        expect(typeSelectButtons.length).toEqual(4);
        typeSelectButtons.at(1).simulate("click");
        const labelInput = wrapper.find("input[name=\"create-resource-label\"]");
        (labelInput.getDOMNode() as HTMLInputElement).value = "Metropolitan Plan";
        labelInput.simulate("change", labelInput);
        const iriInput = wrapper.find("input[name=\"create-resource-iri\"]");
        (iriInput.getDOMNode() as HTMLInputElement).value = iri;
        iriInput.simulate("change", iriInput);
        wrapper.find("button#create-resource-submit").simulate("click");
        expect(onCreate).toHaveBeenCalled();
        const resource = (onCreate as jest.Mock).mock.calls[0][0];
        expect(resource.types).toBeDefined();
        expect(resource.types.indexOf(VocabularyUtils.DATASET)).not.toEqual(-1);
    });

    it("renders CreateFileMetadata component when File type is selected", () => {
        const wrapper = mountWithIntl(<CreateResource onCreate={onCreate}  {...intlFunctions()}/>);
        wrapper.find("button#create-resource-type-file").simulate("click");
        expect(wrapper.find(CreateFileMetadata).exists()).toBeTruthy();
    });

    it("renders CreateResourceMetadata component for all resource types except File", () => {
        const wrapper = mountWithIntl(<CreateResource onCreate={onCreate}  {...intlFunctions()}/>);
        expect(wrapper.find(CreateResourceMetadata).exists()).toBeTruthy();
        wrapper.find("button#create-resource-type-dataset").simulate("click");
        expect(wrapper.find(CreateResourceMetadata).exists()).toBeTruthy();
        wrapper.find("button#create-resource-type-document").simulate("click");
        expect(wrapper.find(CreateResourceMetadata).exists()).toBeTruthy();
    });
});