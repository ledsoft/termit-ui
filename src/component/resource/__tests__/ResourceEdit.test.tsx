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
        const saveButton = component.find("Button[color=\"success\"]");
        saveButton.simulate("click", saveButton);
        expect(save).toHaveBeenCalled();
    });

    it("calls onCancel on Cancel button click", () => {
        const component = mountWithIntl(<ResourceEdit {...intlFunctions()}
                                                      cancel={cancel}
                                                      resource={resource}
                                                      save={save}/>);
        const cancelButton = component.find("Button[color=\"secondary\"]");
        cancelButton.simulate("click", cancelButton);
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
            terms: [new Term({label:"Test",iri:"http://test.org/test"})]
        });

        const instance = wrapper.instance();
        expect((instance as ResourceEdit).state.terms).toEqual([]);
        wrapper.setProps({resource: newResource});
        expect((instance as ResourceEdit).state.terms).toEqual(newResource.terms);
    });
});