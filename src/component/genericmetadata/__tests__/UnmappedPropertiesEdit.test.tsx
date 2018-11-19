import * as React from "react";
import Generator from "../../../__tests__/environment/Generator";
import {mountWithIntl} from "../../../__tests__/environment/Environment";
import {UnmappedPropertiesEdit} from "../UnmappedPropertiesEdit";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";

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
        const label = wrapper.find("label.attribute-label");
        expect(label.length).toEqual(1);
        expect(label.text()).toEqual(property);
        const value = wrapper.find("li");
        expect(value.length).toEqual(1);
        expect(value.text()).toEqual(existing.get(property)![0]);
    });
});