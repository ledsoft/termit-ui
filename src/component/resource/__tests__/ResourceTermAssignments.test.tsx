import * as React from "react";
import Resource from "../../../model/Resource";
import Generator from "../../../__tests__/environment/Generator";
import TermAssignment from "../../../model/TermAssignment";
import {shallow} from "enzyme";
import {ResourceTermAssignments} from "../ResourceTermAssignments";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import {intlDataForShallow, mountWithIntl} from "../../../__tests__/environment/Environment";
import VocabularyUtils from "../../../util/VocabularyUtils";
import TermLink from "../../term/TermLink";
import TermOccurrence from "../../../model/TermOccurrence";

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

    it("renders assigned terms", () => {
        const assignments = [new TermAssignment({
            iri: Generator.generateUri(),
            term: {
                iri: Generator.generateUri(),
                label: "Test term"
            },
            target: {
                source: resource
            },
            types: [VocabularyUtils.TERM_ASSIGNMENT]
        })];
        onLoadAssignments = jest.fn().mockImplementation(() => Promise.resolve(assignments));
        const wrapper = mountWithIntl(<ResourceTermAssignments resource={resource}
                                                         loadTermAssignments={onLoadAssignments} {...intlFunctions()}/>);
        return Promise.resolve().then(() => {
            wrapper.update();
            expect(wrapper.find(TermLink).length).toEqual(1);
            expect(wrapper.find(".m-term-assignment").length).toEqual(1);
        });
    });

    it("renders confirmed term occurrences", () => {
        const assignments = [new TermOccurrence({
            iri: Generator.generateUri(),
            term: {
                iri: Generator.generateUri(),
                label: "Test term"
            },
            target: {
                source: resource
            },
            types: [VocabularyUtils.TERM_ASSIGNMENT, VocabularyUtils.TERM_OCCURRENCE]
        })];
        onLoadAssignments = jest.fn().mockImplementation(() => Promise.resolve(assignments));
        const wrapper = mountWithIntl(<ResourceTermAssignments resource={resource}
                                                               loadTermAssignments={onLoadAssignments} {...intlFunctions()}/>);
        return Promise.resolve().then(() => {
            wrapper.update();
            expect(wrapper.find(TermLink).length).toEqual(1);
            expect(wrapper.find(".m-term-occurrence").length).toEqual(1);
        });
    });

    it("renders suggested term occurrences", () => {
        const assignments = [new TermOccurrence({
            iri: Generator.generateUri(),
            term: {
                iri: Generator.generateUri(),
                label: "Test term"
            },
            target: {
                source: resource
            },
            types: [VocabularyUtils.TERM_ASSIGNMENT, VocabularyUtils.TERM_OCCURRENCE, VocabularyUtils.SUGGESTED_TERM_OCCURRENCE]
        })];
        onLoadAssignments = jest.fn().mockImplementation(() => Promise.resolve(assignments));
        const wrapper = mountWithIntl(<ResourceTermAssignments resource={resource}
                                                               loadTermAssignments={onLoadAssignments} {...intlFunctions()}/>);
        return Promise.resolve().then(() => {
            wrapper.update();
            expect(wrapper.find(TermLink).length).toEqual(1);
            expect(wrapper.find("span.m-term-occurrence-suggested").length).toEqual(1);
        });
    });

    it("renders multiple occurrences of same term once with counter", () => {
        const term = {iri: Generator.generateUri(), label: "Test term"};
        const assignments = [new TermOccurrence({
            iri: Generator.generateUri(),
            term,
            target: {
                source: resource
            },
            types: [VocabularyUtils.TERM_ASSIGNMENT, VocabularyUtils.TERM_OCCURRENCE]
        }), new TermOccurrence({
            iri: Generator.generateUri(),
            term,
            target: {
                source: resource
            },
            types: [VocabularyUtils.TERM_ASSIGNMENT, VocabularyUtils.TERM_OCCURRENCE]
        })];
        onLoadAssignments = jest.fn().mockImplementation(() => Promise.resolve(assignments));
        const wrapper = mountWithIntl(<ResourceTermAssignments resource={resource}
                                                               loadTermAssignments={onLoadAssignments} {...intlFunctions()}/>);
        return Promise.resolve().then(() => {
            wrapper.update();
            expect(wrapper.find(TermLink).length).toEqual(1);
            expect(wrapper.find(".m-term-occurrence").length).toEqual(1);
            expect(wrapper.find("span.m-term-occurrence-confirmed").text()).toContain("2");
        });
    });
});