import * as React from "react";
import Resource from "../../../model/Resource";
import Generator from "../../../__tests__/environment/Generator";
import {shallow} from "enzyme";
import {ResourceTermAssignments} from "../ResourceTermAssignments";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import {intlDataForShallow, mountWithIntl} from "../../../__tests__/environment/Environment";
import VocabularyUtils from "../../../util/VocabularyUtils";
import TermLink from "../../term/TermLink";
import {ResourceTermAssignments as TermAssignmentInfo} from "../../../model/ResourceTermAssignments";
import {MemoryRouter} from "react-router";

describe("ResourceTermAssignments", () => {
    const resource: Resource = new Resource({
        iri: Generator.generateUri(),
        label: "Test resource"
    });
    let onLoadAssignments: (resource: Resource) => Promise<TermAssignmentInfo[]>;

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

    it("renders assigned terms", () => {
        const assignments: TermAssignmentInfo[] = [{
            term: {
                iri: Generator.generateUri()
            },
            label: "Test term",
            resource,
            vocabulary: {
                iri: Generator.generateUri()
            },
            types: [VocabularyUtils.TERM_ASSIGNMENT]
        }];
        onLoadAssignments = jest.fn().mockImplementation(() => Promise.resolve(assignments));
        const wrapper = mountWithIntl(<MemoryRouter><ResourceTermAssignments resource={resource}
                                                                             loadTermAssignments={onLoadAssignments} {...intlFunctions()}/></MemoryRouter>);
        return Promise.resolve().then(() => {
            wrapper.update();
            expect(wrapper.find(TermLink).length).toEqual(1);
            expect(wrapper.find(".m-term-assignment").length).toEqual(1);
        });
    });

    it("renders confirmed term occurrences", () => {
        const assignments = [{
            term: {
                iri: Generator.generateUri()
            },
            label: "Test term",
            resource,
            vocabulary: {
                iri: Generator.generateUri()
            },
            count: 1,
            types: [VocabularyUtils.TERM_ASSIGNMENT, VocabularyUtils.TERM_OCCURRENCE]
        }];
        onLoadAssignments = jest.fn().mockImplementation(() => Promise.resolve(assignments));
        const wrapper = mountWithIntl(<MemoryRouter><ResourceTermAssignments resource={resource}
                                                                             loadTermAssignments={onLoadAssignments} {...intlFunctions()}/></MemoryRouter>);
        return Promise.resolve().then(() => {
            wrapper.update();
            expect(wrapper.find(TermLink).length).toEqual(1);
            expect(wrapper.find(".m-term-occurrence").length).toEqual(1);
        });
    });

    it("renders suggested term occurrences", () => {
        const assignments = [{
            term: {
                iri: Generator.generateUri()
            },
            label: "Test term",
            resource,
            vocabulary: {
                iri: Generator.generateUri()
            },
            count: 1,
            types: [VocabularyUtils.TERM_ASSIGNMENT, VocabularyUtils.TERM_OCCURRENCE, VocabularyUtils.SUGGESTED_TERM_OCCURRENCE]
        }];
        onLoadAssignments = jest.fn().mockImplementation(() => Promise.resolve(assignments));
        const wrapper = mountWithIntl(<MemoryRouter><ResourceTermAssignments resource={resource}
                                                                             loadTermAssignments={onLoadAssignments} {...intlFunctions()}/></MemoryRouter>);
        return Promise.resolve().then(() => {
            wrapper.update();
            expect(wrapper.find(TermLink).length).toEqual(1);
            expect(wrapper.find("span.m-term-occurrence-suggested").length).toEqual(1);
        });
    });

    it("renders term occurrences info with counter", () => {
        const term = {iri: Generator.generateUri(), label: "Test term"};
        const assignments = [{
            term: {
                iri: term.iri
            },
            label: term.label,
            resource,
            vocabulary: {
                iri: Generator.generateUri()
            },
            count: 2,
            types: [VocabularyUtils.TERM_ASSIGNMENT, VocabularyUtils.TERM_OCCURRENCE]
        }];
        onLoadAssignments = jest.fn().mockImplementation(() => Promise.resolve(assignments));
        const wrapper = mountWithIntl(<MemoryRouter><ResourceTermAssignments resource={resource}
                                                                             loadTermAssignments={onLoadAssignments} {...intlFunctions()}/></MemoryRouter>);
        return Promise.resolve().then(() => {
            wrapper.update();
            expect(wrapper.find(TermLink).length).toEqual(1);
            expect(wrapper.find(".m-term-occurrence").length).toEqual(1);
            expect(wrapper.find("span.m-term-occurrence-confirmed").text()).toContain("2");
        });
    });
});