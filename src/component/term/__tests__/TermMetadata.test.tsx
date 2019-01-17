import * as React from "react";
import Term from "../../../model/Term";
import Generator from "../../../__tests__/environment/Generator";
import {intlDataForShallow, mountWithIntl} from "../../../__tests__/environment/Environment";
import {TermMetadata} from "../TermMetadata";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import Vocabulary from "../../../model/Vocabulary";
import VocabularyUtils from "../../../util/VocabularyUtils";
import {AssetLabel} from "../../misc/AssetLabel";
import {shallow} from "enzyme";
import {TermLink} from "../TermLink";
import {MemoryRouter} from "react-router";

jest.mock("../../../util/Routing");
jest.mock("../TermAssignments");

describe("TermMetadata", () => {

    const vocabulary: Vocabulary = new Vocabulary({
        iri: Generator.generateUri(),
        label: "Test vocabulary"
    });
    let term: Term;
    let loadSubTerms: (t: Term, voc: Vocabulary) => Promise<Term[]>;

    beforeEach(() => {
        term = new Term({
            iri: Generator.generateUri(),
            label: "Test",
            comment: "test"
        });
        loadSubTerms = jest.fn().mockImplementation(() => Promise.resolve([]));
    });

    it("loads sub terms after mount", () => {
        shallow(<TermMetadata vocabulary={vocabulary} term={term}
                              loadSubTerms={loadSubTerms} {...intlFunctions()} {...intlDataForShallow()}/>);
        expect(loadSubTerms).toHaveBeenCalledWith(term, vocabulary);
    });

    it("renders loaded sub terms as term links", () => {
        const subTerms: Term[] = [new Term({
            iri: Generator.generateUri(),
            label: "SubTerm",
            vocabulary: {iri: vocabulary.iri}
        })];
        loadSubTerms = jest.fn().mockImplementation(() => Promise.resolve(subTerms));
        const wrapper = mountWithIntl(<MemoryRouter><TermMetadata vocabulary={vocabulary} term={term}
                                                                  loadSubTerms={loadSubTerms} {...intlFunctions()}/></MemoryRouter>);
        return Promise.resolve().then(() => {
            wrapper.update();
            const subTermLinks = wrapper.find(TermLink);
            expect(subTermLinks.length).toEqual(subTermLinks.length);
        })
    });

    it("reloads sub terms when term prop changes", () => {
        const wrapper = shallow(<TermMetadata vocabulary={vocabulary} term={term}
                              loadSubTerms={loadSubTerms} {...intlFunctions()} {...intlDataForShallow()}/>);
        expect(loadSubTerms).toHaveBeenCalledWith(term, vocabulary);
        const otherTerm = new Term({
            iri: Generator.generateUri(),
            label: "SubTerm",
            vocabulary: {iri: vocabulary.iri}
        });
        wrapper.setProps({term: otherTerm});
        wrapper.update();
        expect(loadSubTerms).toHaveBeenCalledWith(otherTerm, vocabulary);
    });

    it("skips implicit term type when rendering types", () => {
        term.types = [VocabularyUtils.TERM, Generator.generateUri()];
        const wrapper = mountWithIntl(<MemoryRouter><TermMetadata vocabulary={vocabulary} term={term}
                                                                  loadSubTerms={loadSubTerms} {...intlFunctions()}/></MemoryRouter>);
        const renderedTypes = wrapper.find(AssetLabel);
        expect(renderedTypes.length).toEqual(1);
        expect(renderedTypes.text()).toEqual(term.types[1]);
    });
});