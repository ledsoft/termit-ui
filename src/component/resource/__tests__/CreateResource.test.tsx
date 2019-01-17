import * as React from "react";
import Ajax, {params} from "../../../util/Ajax";
import {mountWithIntl} from "../../../__tests__/environment/Environment";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import {Button} from "reactstrap";
import Routing from "../../../util/Routing";
import Routes from "../../../util/Routes";
import Constants from "../../../util/Constants";
import Resource from "../../../model/Resource";
import {CreateResource} from "../CreateResource";

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
        wrapper.find(Button).at(1).simulate("click");
        expect(Routing.transitionTo).toHaveBeenCalledWith(Routes.resources);
    });

    it("enables submit button only when name is not empty", () => {
        const wrapper = mountWithIntl(<CreateResource onCreate={onCreate}  {...intlFunctions()}/>);
        let submitButton = wrapper.find(Button).first();
        expect(submitButton.getElement().props.disabled).toBeTruthy();
        const labelInput = wrapper.find("input[name=\"create-resource.label\"]");
        (labelInput.getDOMNode() as HTMLInputElement).value = "Metropolitan Plan";
        labelInput.simulate("change", labelInput);
        submitButton = wrapper.find(Button).first();
        expect(submitButton.getElement().props.disabled).toBeFalsy();
    });

    it("calls onCreate on submit click", () => {
        const wrapper = mountWithIntl(<CreateResource onCreate={onCreate}  {...intlFunctions()}/>);
        const labelInput = wrapper.find("input[name=\"create-resource.label\"]");
        const label = "Metropolitan Plan";
        (labelInput.getDOMNode() as HTMLInputElement).value = label;
        labelInput.simulate("change", labelInput);
        return Ajax.get(Constants.API_PREFIX + "/resources/identifier").then(() => {
            const submitButton = wrapper.find(Button).first();
            submitButton.simulate("click");
            expect(onCreate).toHaveBeenCalled();
            const newResource = (onCreate as jest.Mock).mock.calls[0][0];
            expect(newResource.iri).toEqual(iri);
            expect(newResource.label).toEqual(label);
        });
    });

    describe("IRI generation", () => {
        it("requests IRI generation when name changes", () => {
            const wrapper = mountWithIntl(<CreateResource onCreate={onCreate}  {...intlFunctions()}/>);
            const labelInput = wrapper.find("input[name=\"create-resource.label\"]");
            const label = "Metropolitan Plan";
            (labelInput.getDOMNode() as HTMLInputElement).value = label;
            labelInput.simulate("change", labelInput);
            return Promise.resolve().then(() => {
                expect(Ajax.get).toHaveBeenCalledWith(Constants.API_PREFIX + "/resources/identifier", params({name: label}));
            });
        });

        it("does not request IRI generation when IRI value had been changed manually before", () => {
            const wrapper = mountWithIntl(<CreateResource onCreate={onCreate}  {...intlFunctions()}/>);
            const iriInput = wrapper.find("input[name=\"create-resource.iri\"]");
            (iriInput.getDOMNode() as HTMLInputElement).value = "http://test";
            iriInput.simulate("change", iriInput);
            const nameInput = wrapper.find("input[name=\"create-resource.label\"]");
            (nameInput.getDOMNode() as HTMLInputElement).value = "Metropolitan Plan";
            nameInput.simulate("change", nameInput);
            expect(Ajax.get).not.toHaveBeenCalled();
        });

        it("displays IRI generated and returned by the server", () => {
            const wrapper = mountWithIntl(<CreateResource onCreate={onCreate}  {...intlFunctions()}/>);
            const labelInput = wrapper.find("input[name=\"create-resource.label\"]");
            (labelInput.getDOMNode() as HTMLInputElement).value = "Metropolitan Plan";
            labelInput.simulate("change", labelInput);
            return Ajax.get(Constants.API_PREFIX + "/resources/identifier").then(() => {
                const iriInput = wrapper.find("input[name=\"create-resource.iri\"]");
                return expect((iriInput.getDOMNode() as HTMLInputElement).value).toEqual(iri);
            });
        });
    });
});