import * as React from "react";
import Resource from "../../../model/Resource";
import {mountWithIntl} from "../../../__tests__/environment/Environment";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import Generator from "../../../__tests__/environment/Generator";
import {ResourceEdit} from "../ResourceEdit";
import {shallow} from "enzyme";
import Term from "../../../model/Term";

describe("ResourceEdit", () => {
    let resource: Resource;
    let cancel: () => Promise<any>;
    let save: () => Promise<any>;

    beforeEach(() => {
        resource = new Resource({
            iri: Generator.generateUri(),
            label: "test term",
            terms: []
        });
        cancel = jest.fn();
        save = jest.fn();
    });

    it("calls onSave on Save button click", () => {
        const component = mountWithIntl(<ResourceEdit {...intlFunctions()}
                                                      cancel={cancel}
                                                      resource={resource}
                                                      save={save}/>);
        const saveButton = component.find("button[name=\"edit-resource.submit\"]");
        saveButton.simulate("click", saveButton);
        expect(save).toHaveBeenCalled();
    });

    it("calls onCancel on Cancel button click", () => {
        const component = mountWithIntl(<ResourceEdit {...intlFunctions()}
                                                      cancel={cancel}
                                                      resource={resource}
                                                      save={save}/>);
        component.find("button[name=\"edit-resource.cancel\"]").simulate("click");
        expect(cancel).toHaveBeenCalled();
    });

    it("loads terms on resource update", () => {
        const wrapper = shallow(<ResourceEdit {...intlFunctions()}
                                              cancel={cancel}
                                              resource={resource}
                                              save={save}/>);
        const newResource = new Resource({
            iri: Generator.generateUri(),
            label: "test term",
            terms: [new Term({label: "Test", iri: "http://test.org/test"})]
        });

        const instance = wrapper.instance();
        expect((instance as ResourceEdit).state.terms).toEqual([]);
        wrapper.setProps({resource: newResource});
        expect((instance as ResourceEdit).state.terms).toEqual(newResource.terms);
    });

    it("passes updated values on save", () => {
        const component = mountWithIntl(<ResourceEdit {...intlFunctions()} save={save} cancel={cancel}
                                                      resource={resource}/>);
        const labelInput = component.find("input[name='resource-edit-label']");
        const newLabel = "New label";
        (labelInput.getDOMNode() as HTMLInputElement).value = newLabel;
        labelInput.simulate("change", labelInput);
        const descriptionInput = component.find("textarea[name='resource-edit-description']");
        const newDescription = "New description";
        (descriptionInput.getDOMNode() as HTMLInputElement).value = newDescription;
        descriptionInput.simulate("change", descriptionInput);
        component.find("Button[color='success']").simulate("click");
        expect(save).toHaveBeenCalled();
        const update = (save as jest.Mock).mock.calls[0][0];
        expect(update).not.toEqual(resource);
        expect(update.label).toEqual(newLabel);
        expect(update.description).toEqual(newDescription);
        expect(update.terms).toEqual(resource.terms);
    });
});