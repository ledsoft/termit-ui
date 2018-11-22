import * as React from "react";
import Generator from "../../../__tests__/environment/Generator";
import {mountWithIntl} from "../../../__tests__/environment/Environment";
import {UnmappedPropertiesEdit} from "../UnmappedPropertiesEdit";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import {Badge} from "reactstrap";
import {GoPlus} from "react-icons/go";

describe("UnmappedPropertiesEdit", () => {

    let onChange: (update: Map<string, string[]>) => void;

    beforeEach(() => {
        onChange = jest.fn();
    });

    it("renders existing properties", () => {
        const property = Generator.generateUri();
        const existing = new Map([[property, ["test"]]]);
        const wrapper = mountWithIntl(<UnmappedPropertiesEdit properties={existing}
                                                              onChange={onChange} {...intlFunctions()}/>);
        const value = wrapper.find("li");
        expect(value.length).toEqual(1);
        expect(value.text()).toEqual(existing.get(property)![0]);
    });

    it('removes prop value when delete button is clicked', () => {
        const property = Generator.generateUri();
        const existing = new Map([[property, ["test1", "test2"]]]);
        const wrapper = mountWithIntl(<UnmappedPropertiesEdit properties={existing}
                                                              onChange={onChange} {...intlFunctions()}/>);

        const removeButtons = wrapper.find(Badge);
        expect(removeButtons.length).toEqual(2);
        removeButtons.at(0).simulate("click");
        expect(onChange).toHaveBeenCalledWith(new Map([[property, ["test2"]]]));
    });

    it("removes property completely when only value is deleted", () => {
        const property = Generator.generateUri();
        const existing = new Map([[property, ["test1"]]]);
        const wrapper = mountWithIntl(<UnmappedPropertiesEdit properties={existing}
                                                              onChange={onChange} {...intlFunctions()}/>);

        const removeButton = wrapper.find(Badge);
        expect(removeButton.length).toEqual(1);
        removeButton.simulate("click");
        expect(onChange).toHaveBeenCalledWith(new Map());
    });

    it("adds new property with value when inputs are filled in and add button is clicked", () => {
        const wrapper = mountWithIntl(<UnmappedPropertiesEdit properties={new Map()}
                                                              onChange={onChange} {...intlFunctions()}/>);
        const property = Generator.generateUri();
        const value = "test";
        const propertyInput = wrapper.find("input[name=\"property\"]");
        (propertyInput.getDOMNode() as HTMLInputElement).value = property;
        propertyInput.simulate("change", propertyInput);
        const valueInput = wrapper.find("input[name=\"value\"]");
        (valueInput.getDOMNode() as HTMLInputElement).value = value;
        valueInput.simulate("change", valueInput);
        wrapper.find(GoPlus).simulate("click");
        expect(onChange).toHaveBeenCalledWith(new Map([[property, [value]]]));
    });

    it("adds existing property value when inputs are filled in and add button is clicked", () => {
        const property = Generator.generateUri();
        const existing = new Map([[property, ["test"]]]);
        const wrapper = mountWithIntl(<UnmappedPropertiesEdit properties={existing}
                                                              onChange={onChange} {...intlFunctions()}/>);
        const value = "test2";
        const propertyInput = wrapper.find("input[name=\"property\"]");
        (propertyInput.getDOMNode() as HTMLInputElement).value = property;
        propertyInput.simulate("change", propertyInput);
        const valueInput = wrapper.find("input[name=\"value\"]");
        (valueInput.getDOMNode() as HTMLInputElement).value = value;
        valueInput.simulate("change", valueInput);
        wrapper.find(GoPlus).simulate("click");
        expect(onChange).toHaveBeenCalledWith(new Map([[property, ["test", "test2"]]]));
    });

    it("clears state on add", () => {
        const wrapper = mountWithIntl(<UnmappedPropertiesEdit properties={new Map()}
                                                              onChange={onChange} {...intlFunctions()}/>);
        const property = Generator.generateUri();
        const value = "test";
        const propertyInput = wrapper.find("input[name=\"property\"]");
        (propertyInput.getDOMNode() as HTMLInputElement).value = property;
        propertyInput.simulate("change", propertyInput);
        const valueInput = wrapper.find("input[name=\"value\"]");
        (valueInput.getDOMNode() as HTMLInputElement).value = value;
        valueInput.simulate("change", valueInput);
        wrapper.find(GoPlus).simulate("click");
        expect((wrapper.find("input[name=\"property\"]").getDOMNode() as HTMLInputElement).value.length).toEqual(0);
        expect((wrapper.find("input[name=\"value\"]").getDOMNode() as HTMLInputElement).value.length).toEqual(0);
    });

    it("keeps add button disabled when either input is empty", () => {
        const wrapper = mountWithIntl(<UnmappedPropertiesEdit properties={new Map()}
                                                              onChange={onChange} {...intlFunctions()}/>);
        let addButton = wrapper.find(GoPlus).parent();
        expect(addButton.prop("disabled")).toBeTruthy();
        const propertyInput = wrapper.find("input[name=\"property\"]");
        (propertyInput.getDOMNode() as HTMLInputElement).value = "a";
        propertyInput.simulate("change", propertyInput);
        addButton = wrapper.find(GoPlus).parent();
        expect(addButton.prop("disabled")).toBeTruthy();
        const valueInput = wrapper.find("input[name=\"value\"]");
        (valueInput.getDOMNode() as HTMLInputElement).value = "b";
        valueInput.simulate("change", valueInput);
        addButton = wrapper.find(GoPlus).parent();
        expect(addButton.prop("disabled")).toBeFalsy();
    });

    it("adds property value on Enter in the value field", () => {
        const wrapper = mountWithIntl(<UnmappedPropertiesEdit properties={new Map()}
                                                              onChange={onChange} {...intlFunctions()}/>);
        const property = Generator.generateUri();
        const value = "test";
        const propertyInput = wrapper.find("input[name=\"property\"]");
        (propertyInput.getDOMNode() as HTMLInputElement).value = property;
        propertyInput.simulate("change", propertyInput);
        const valueInput = wrapper.find("input[name=\"value\"]");
        (valueInput.getDOMNode() as HTMLInputElement).value = value;
        valueInput.simulate("change", valueInput);
        valueInput.simulate("keyPress", {key: 'Enter'});
        expect(onChange).toHaveBeenCalled();
    });
});