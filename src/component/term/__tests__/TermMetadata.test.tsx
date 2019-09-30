import * as React from "react";
import Term, {TermInfo} from "../../../model/Term";
import Generator from "../../../__tests__/environment/Generator";
import {intlDataForShallow} from "../../../__tests__/environment/Environment";
import {TermMetadata} from "../TermMetadata";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import Vocabulary from "../../../model/Vocabulary";
import VocabularyUtils from "../../../util/VocabularyUtils";
import {shallow} from "enzyme";
import TermLink from "../TermLink";
import OutgoingLink from "../../misc/OutgoingLink";

jest.mock("../../../util/Routing");
jest.mock("../TermAssignments");

describe("TermMetadata", () => {

    const vocabulary: Vocabulary = new Vocabulary({
        iri: Generator.generateUri(),
        label: "Test vocabulary"
    });
    let term: Term;

    beforeEach(() => {
        term = new Term({
            iri: Generator.generateUri(),
            label: "Test",
            comment: "test",
            vocabulary: {iri: vocabulary.iri}
        });
    });

    it("renders sub terms as term links", () => {
        const subTerms: TermInfo[] = [{
            iri: Generator.generateUri(),
            label: "SubTerm",
            vocabulary: {iri: vocabulary.iri}
        }];
        term.subTerms = subTerms;
        const wrapper = shallow(<TermMetadata term={term} {...intlFunctions()} {...intlDataForShallow()}/>);
        const subTermLinks = wrapper.find(TermLink);
        expect(subTermLinks.length).toEqual(subTerms.length);
    });

    it("skips implicit term type when rendering types", () => {
        term.types = [VocabularyUtils.TERM, Generator.generateUri()];
        const wrapper = shallow(<TermMetadata term={term} {...intlFunctions()} {...intlDataForShallow()}/>);
        const renderedTypes = wrapper.find(OutgoingLink);
        expect(renderedTypes.length).toEqual(1);
        expect(renderedTypes.get(0).props.iri).toEqual(term.types[1]);
    });

    it("renders parent term link when parent term exists", () => {
        term.parentTerms = [new Term({
            iri: Generator.generateUri(),
            label: "Parent",
            vocabulary: {iri: Generator.generateUri()}
        })];
        const wrapper = shallow(<TermMetadata term={term} {...intlFunctions()} {...intlDataForShallow()}/>);
        const parentLinks = wrapper.find(TermLink);
        expect(parentLinks.length).toEqual(term.parentTerms.length);
    });
});
