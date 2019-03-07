import * as React from "react";
import Resource from "../../../model/Resource";
import Generator from "../../../__tests__/environment/Generator";
import TermAssignment from "../../../model/TermAssignment";
import {shallow} from "enzyme";
import {ResourceTermAssignments} from "../ResourceTermAssignments";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import {intlDataForShallow} from "../../../__tests__/environment/Environment";

describe("ResourceTermAssignments", () => {
    const resource: Resource = new Resource({
        iri: Generator.generateUri(),
        label: "Test resource"
    });
    let onLoadAssignments: (resource: Resource) => Promise<TermAssignment[]>;

    beforeEach(() => {
        onLoadAssignments = jest.fn().mockImplementation(() => Promise.resolve([]));
    });

    it("loads term assignments on mount", () => {
        shallow(<ResourceTermAssignments resource={resource}
                                         loadTermAssignments={onLoadAssignments} {...intlFunctions()} {...intlDataForShallow()}/>);
        expect(onLoadAssignments).toHaveBeenCalledWith(resource);
    });

    it("reloads term assignments when different resource is passed in props", () => {
        const differentResource: Resource = new Resource({
            iri: Generator.generateUri(),
            label: "Different resource"
        });
        const wrapper = shallow(<ResourceTermAssignments resource={resource}
                                                         loadTermAssignments={onLoadAssignments} {...intlFunctions()} {...intlDataForShallow()}/>);
        wrapper.setProps({resource: differentResource});
        wrapper.update();
        expect(onLoadAssignments).toHaveBeenCalledWith(differentResource);
        expect(onLoadAssignments).toHaveBeenCalledTimes(2);
    });

    it("does nothing on update when resource is the same", () => {
        const wrapper = shallow(<ResourceTermAssignments resource={resource}
                                                         loadTermAssignments={onLoadAssignments} {...intlFunctions()} {...intlDataForShallow()}/>);
        wrapper.setProps({resource});
        wrapper.update();
        expect(onLoadAssignments).toHaveBeenCalledWith(resource);
        expect(onLoadAssignments).toHaveBeenCalledTimes(1);
    });
});