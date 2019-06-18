import * as React from "react";
import Term from "../../../model/Term";
import Generator from "../../../__tests__/environment/Generator";
import {intlDataForShallow} from "../../../__tests__/environment/Environment";
import {TermMetadata} from "../TermMetadata";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import Vocabulary from "../../../model/Vocabulary";
import VocabularyUtils, {IRI} from "../../../util/VocabularyUtils";
import {shallow} from "enzyme";
import TermLink from "../TermLink";
import AssetIriLink from "../../misc/AssteIriLink";
import OutgoingLink from "../../misc/OutgoingLink";

jest.mock("../../../util/Routing");
jest.mock("../TermAssignments");

describe("TermMetadata", () => {

    const vocabulary: Vocabulary = new Vocabulary({
        iri: Generator.generateUri(),
        label: "Test vocabulary"
    });
    let term: Term;
    let loadSubTerms: (t: Term, vocIri: IRI) => Promise<Term[]>;

    beforeEach(() => {
        term = new Term({
            iri: Generator.generateUri(),
            label: "Test",
            comment: "test",
            vocabulary: {iri: vocabulary.iri}
        });
        loadSubTerms = jest.fn().mockImplementation(() => Promise.resolve([]));
    });

    it("loads sub terms after mount", () => {
        shallow(<TermMetadata term={term} loadSubTerms={loadSubTerms} {...intlFunctions()} {...intlDataForShallow()}/>);
        expect(loadSubTerms).toHaveBeenCalledWith(term, VocabularyUtils.create(vocabulary.iri));
    });

    it("renders loaded sub terms as term links", () => {
        const subTerms: Term[] = [new Term({
            iri: Generator.generateUri(),
            label: "SubTerm",
            vocabulary: {iri: vocabulary.iri}
        })];
        loadSubTerms = jest.fn().mockImplementation(() => Promise.resolve(subTerms));
        const wrapper = shallow(<TermMetadata term={term}
                                              loadSubTerms={loadSubTerms} {...intlFunctions()} {...intlDataForShallow()}/>);
        return Promise.resolve().then(() => {
            wrapper.update();
            const subTermLinks = wrapper.find(TermLink);
            expect(subTermLinks.length).toEqual(subTermLinks.length);
        })
    });

    it("reloads sub terms when term prop changes", () => {
        const wrapper = shallow(<TermMetadata term={term}
                                              loadSubTerms={loadSubTerms} {...intlFunctions()} {...intlDataForShallow()}/>);
        expect(loadSubTerms).toHaveBeenCalledWith(term, VocabularyUtils.create(vocabulary.iri));
        const otherTerm = new Term({
            iri: Generator.generateUri(),
            label: "SubTerm",
            vocabulary: {iri: vocabulary.iri}
        });
        wrapper.setProps({term: otherTerm});
        wrapper.update();
        expect(loadSubTerms).toHaveBeenCalledWith(otherTerm, VocabularyUtils.create(vocabulary.iri));
    });

    it("skips implicit term type when rendering types", () => {
        term.types = [VocabularyUtils.TERM, Generator.generateUri()];
        const wrapper = shallow(<TermMetadata term={term} loadSubTerms={loadSubTerms} {...intlFunctions()}/>);
        const renderedTypes = wrapper.find(OutgoingLink);
        expect(renderedTypes.length).toEqual(1);
        expect(renderedTypes.get(0).props.iri).toEqual(term.types[1]);
    });

    it("renders parent term link when parent term exists", () => {
        term.parentTerm = {iri: Generator.generateUri()};
        const wrapper = shallow(<TermMetadata term={term}
                                              loadSubTerms={loadSubTerms} {...intlFunctions()} {...intlDataForShallow()}/>);
        const parentLink = wrapper.find(AssetIriLink);
        expect(parentLink.exists()).toBeTruthy();
        expect(parentLink.prop("id")).toEqual("term-metadata-parent");
    });
});