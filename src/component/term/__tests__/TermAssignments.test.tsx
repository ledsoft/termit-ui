import * as React from "react";
import Term from "../../../model/Term";
import Generator from "../../../__tests__/environment/Generator";
import {intlDataForShallow, mountWithIntl} from "../../../__tests__/environment/Environment";
import {TermAssignments} from "../TermAssignments";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import {shallow} from "enzyme";
import TermAssignment from "../../../model/TermAssignment";
import VocabularyUtils from "../../../util/VocabularyUtils";
import {Badge, Button} from "reactstrap";

describe("TermAssignments", () => {

    let loadTermAssignments: (term: Term) => Promise<any>;
    let term: Term;

    beforeEach(() => {
        loadTermAssignments = jest.fn().mockImplementation(() => Promise.resolve([]));
        term = new Term({
            iri: Generator.generateUri(),
            label: "Test term",
            vocabulary: {
                iri: Generator.generateUri()
            }
        });
    });

    it("does not render anything when no assignments are available", () => {
        const wrapper = mountWithIntl(<TermAssignments term={term}
                                                       loadTermAssignments={loadTermAssignments} {...intlFunctions()}/>);
        expect(wrapper.find(".additional-metadata").exists()).toBeFalsy();
    });

    it("loads assignments on mount", () => {
        shallow(<TermAssignments term={term} loadTermAssignments={loadTermAssignments}
                                 {...intlFunctions()} {...intlDataForShallow()}/>);
        expect(loadTermAssignments).toHaveBeenCalledWith(term);
    });

    it("renders assignments when they are loaded", () => {
        const assignments = [new TermAssignment({
            iri: Generator.generateUri(),
            term,
            target: {
                source: {
                    iri: Generator.generateUri(),
                    label: "Test resource"
                }
            },
            types: [VocabularyUtils.TERM_ASSIGNMENT]
        })];
        loadTermAssignments = jest.fn().mockImplementation(() => Promise.resolve(assignments));
        const wrapper = mountWithIntl(<TermAssignments term={term}
                                                       loadTermAssignments={loadTermAssignments} {...intlFunctions()}/>);
        return Promise.resolve().then(() => {
            wrapper.update();
            expect(wrapper.find(".additional-metadata").exists()).toBeTruthy();
        });
    });

    it("reloads assignments on update", () => {
        const wrapper = shallow(<TermAssignments term={term} loadTermAssignments={loadTermAssignments}
                                                 {...intlFunctions()} {...intlDataForShallow()}/>);
        expect(loadTermAssignments).toHaveBeenCalledWith(term);
        const differentTerm = new Term({
            iri: Generator.generateUri(),
            label: "Different term",
            vocabulary: {
                iri: Generator.generateUri()
            }
        });
        wrapper.setProps({term: differentTerm});
        wrapper.update();
        expect(loadTermAssignments).toHaveBeenCalledWith(differentTerm);
        expect(loadTermAssignments).toHaveBeenCalledTimes(2);
    });

    it("does not reload assignments if the term is still the same", () => {
        const wrapper = shallow(<TermAssignments term={term} loadTermAssignments={loadTermAssignments}
                                                 {...intlFunctions()} {...intlDataForShallow()}/>);
        wrapper.update();
        expect(loadTermAssignments).toHaveBeenCalledTimes(1);
    });

    it("renders assignment target resource name as link", () => {
        const assignments = [new TermAssignment({
            iri: Generator.generateUri(),
            term,
            target: {
                source: {
                    iri: Generator.generateUri(),
                    label: "Test resource"
                }
            },
            types: [VocabularyUtils.TERM_ASSIGNMENT]
        })];
        loadTermAssignments = jest.fn().mockImplementation(() => Promise.resolve(assignments));
        const wrapper = mountWithIntl(<TermAssignments term={term}
                                                       loadTermAssignments={loadTermAssignments} {...intlFunctions()}/>);
        return Promise.resolve().then(() => {
            wrapper.update();
            const link = wrapper.find(Button).findWhere(b => b.prop("color") === "link");
            expect(link.exists()).toBeTruthy();
            expect(link.text()).toEqual(assignments[0].target.source.label);
        });
    });

    it("renders target resource only once if multiple assignments point to the same resource", () => {
        const fileIri = Generator.generateUri();
        const fileName = "Test file";
        const assignments = [new TermAssignment({
            iri: Generator.generateUri(),
            term,
            target: {
                source: {
                    iri: fileIri,
                    label: fileName
                }
            },
            types: [VocabularyUtils.TERM_ASSIGNMENT]
        }), new TermAssignment({
            iri: Generator.generateUri(),
            term,
            target: {
                source: {
                    iri: fileIri,
                    label: fileName
                }
            },
            types: [VocabularyUtils.TERM_ASSIGNMENT]
        })];
        loadTermAssignments = jest.fn().mockImplementation(() => Promise.resolve(assignments));
        const wrapper = mountWithIntl(<TermAssignments term={term}
                                                       loadTermAssignments={loadTermAssignments} {...intlFunctions()}/>);
        return Promise.resolve().then(() => {
            wrapper.update();
            const link = wrapper.find(Button).findWhere(b => b.prop("color") === "link");
            expect(link.length).toEqual(1);
        });
    });

    it("renders resource with badge showing number of occurrences of term in file", () => {
        const fileIri = Generator.generateUri();
        const fileName = "Test file";
        const assignments = [new TermAssignment({
            iri: Generator.generateUri(),
            term,
            target: {
                source: {
                    iri: fileIri,
                    label: fileName
                }
            },
            types: [VocabularyUtils.TERM_ASSIGNMENT]
        }), new TermAssignment({
            iri: Generator.generateUri(),
            term,
            target: {
                source: {
                    iri: fileIri,
                    label: fileName
                }
            },
            types: [VocabularyUtils.TERM_ASSIGNMENT]
        })];
        loadTermAssignments = jest.fn().mockImplementation(() => Promise.resolve(assignments));
        const wrapper = mountWithIntl(<TermAssignments term={term}
                                                       loadTermAssignments={loadTermAssignments} {...intlFunctions()}/>);
        return Promise.resolve().then(() => {
            wrapper.update();
            const badge = wrapper.find(Badge);
            expect(badge.exists()).toBeTruthy();
            expect(badge.text()).toEqual("2");
        });
    });
});