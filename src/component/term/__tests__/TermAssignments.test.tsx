import * as React from "react";
import Term from "../../../model/Term";
import Generator from "../../../__tests__/environment/Generator";
import {intlDataForShallow, mountWithIntl} from "../../../__tests__/environment/Environment";
import {TermAssignments} from "../TermAssignments";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import {ReactWrapper, shallow} from "enzyme";
import TermAssignment from "../../../model/TermAssignment";
import VocabularyUtils from "../../../util/VocabularyUtils";
import {Badge} from "reactstrap";
import {MemoryRouter} from "react-router";
import {ResourceLink} from "../../resource/ResourceLink";
import TermOccurrence from "../../../model/TermOccurrence";

describe("TermAssignments", () => {

    let loadTermAssignments: (term: Term) => Promise<any>;
    const onAssignmentsLoad: (assignmentsCount: number) => void = jest.fn();
    let term: Term;

    let element: HTMLDivElement;
    let mounted: ReactWrapper;

    beforeEach(() => {
        loadTermAssignments = jest.fn().mockImplementation(() => Promise.resolve([]));
        term = new Term({
            iri: Generator.generateUri(),
            label: "Test term",
            vocabulary: {
                iri: Generator.generateUri()
            }
        });
        element = document.createElement("div");
        element.id = "root";
        document.body.appendChild(element);
        jest.useFakeTimers();
    });

    afterEach(() => {
        mounted.unmount();
        jest.clearAllTimers();
        document.body.removeChild(element);
    });

    it("does not render anything when no assignments are available", () => {
        mounted = mountWithIntl(<TermAssignments term={term} onAssignmentsLoad={onAssignmentsLoad}
                                                 loadTermAssignments={loadTermAssignments} {...intlFunctions()}/>);
        expect(mounted.find(".additional-metadata").exists()).toBeFalsy();
    });

    it("loads assignments on mount", () => {
        shallow(<TermAssignments term={term} loadTermAssignments={loadTermAssignments}
                                 onAssignmentsLoad={onAssignmentsLoad}
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
                    label: "Test resource",
                    terms: []
                }
            },
            types: [VocabularyUtils.TERM_ASSIGNMENT]
        })];
        loadTermAssignments = jest.fn().mockImplementation(() => Promise.resolve(assignments));
        mounted = mountWithIntl(<MemoryRouter><TermAssignments term={term} onAssignmentsLoad={onAssignmentsLoad}
                                                               loadTermAssignments={loadTermAssignments} {...intlFunctions()}/>
        </MemoryRouter>, {attachTo: element});
        return Promise.resolve().then(() => {
            mounted.update();
            expect(mounted.find(".additional-metadata-container").exists()).toBeTruthy();
        });
    });

    it("reloads assignments on update", () => {
        const wrapper = shallow(<TermAssignments term={term} loadTermAssignments={loadTermAssignments}
                                                 onAssignmentsLoad={onAssignmentsLoad}
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
                                                 onAssignmentsLoad={onAssignmentsLoad}
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
                    label: "Test resource",
                    terms: []
                }
            },
            types: [VocabularyUtils.TERM_ASSIGNMENT]
        })];
        loadTermAssignments = jest.fn().mockImplementation(() => Promise.resolve(assignments));
        mounted = mountWithIntl(<MemoryRouter><TermAssignments term={term} onAssignmentsLoad={onAssignmentsLoad}
                                                               loadTermAssignments={loadTermAssignments} {...intlFunctions()}/>
        </MemoryRouter>, {attachTo: element});
        return Promise.resolve().then(() => {
            mounted.update();
            const link = mounted.find(ResourceLink);
            expect(link.exists()).toBeTruthy();
            expect(link.text()).toContain(assignments[0].target.source.label);
        });
    });

    it("renders target resource only once if multiple occurrences point to the same resource", () => {
        const fileIri = Generator.generateUri();
        const fileName = "Test file";
        const occurrences = [new TermOccurrence({
            iri: Generator.generateUri(),
            term,
            target: {
                source: {
                    iri: fileIri,
                    label: fileName,
                    terms: []
                }
            },
            types: [VocabularyUtils.TERM_ASSIGNMENT, VocabularyUtils.TERM_OCCURRENCE]
        }), new TermOccurrence({
            iri: Generator.generateUri(),
            term,
            target: {
                source: {
                    iri: fileIri,
                    label: fileName,
                    terms: []
                }
            },
            types: [VocabularyUtils.TERM_ASSIGNMENT, VocabularyUtils.TERM_OCCURRENCE]
        })];
        loadTermAssignments = jest.fn().mockImplementation(() => Promise.resolve(occurrences));
        mounted = mountWithIntl(<MemoryRouter><TermAssignments term={term} onAssignmentsLoad={onAssignmentsLoad}
                                                               loadTermAssignments={loadTermAssignments} {...intlFunctions()}/></MemoryRouter>, {attachTo: element});
        return Promise.resolve().then(() => {
            mounted.update();
            const link = mounted.find(ResourceLink);
            expect(link.length).toEqual(1);
        });
    });

    it("renders resource with badge showing number of occurrences of term in file", () => {
        const fileIri = Generator.generateUri();
        const fileName = "Test file";
        const occurrences = [new TermOccurrence({
            iri: Generator.generateUri(),
            term,
            target: {
                source: {
                    iri: fileIri,
                    label: fileName,
                    terms: []
                }
            },
            types: [VocabularyUtils.TERM_ASSIGNMENT, VocabularyUtils.TERM_OCCURRENCE]
        }), new TermOccurrence({
            iri: Generator.generateUri(),
            term,
            target: {
                source: {
                    iri: fileIri,
                    label: fileName,
                    terms: []
                }
            },
            types: [VocabularyUtils.TERM_ASSIGNMENT, VocabularyUtils.TERM_OCCURRENCE]
        })];
        loadTermAssignments = jest.fn().mockImplementation(() => Promise.resolve(occurrences));
        mounted = mountWithIntl(<MemoryRouter><TermAssignments term={term} onAssignmentsLoad={onAssignmentsLoad}
                                                               loadTermAssignments={loadTermAssignments} {...intlFunctions()}/></MemoryRouter>, {attachTo: element});
        return Promise.resolve().then(() => {
            mounted.update();
            const badge = mounted.find(Badge);
            expect(badge.exists()).toBeTruthy();
            expect(badge.text()).toEqual("2");
        });
    });
});