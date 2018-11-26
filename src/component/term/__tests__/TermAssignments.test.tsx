import * as React from "react";
import Term from "../../../model/Term";
import Generator from "../../../__tests__/environment/Generator";
import {intlDataForShallow, mountWithIntl} from "../../../__tests__/environment/Environment";
import {TermAssignments} from "../TermAssignments";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import {shallow} from "enzyme";
import TermAssignment from "../../../model/TermAssignment";
import VocabularyUtils from "../../../util/VocabularyUtils";

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
});