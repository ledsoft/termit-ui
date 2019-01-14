import * as React from "react";
import Term from "../../../model/Term";
import Generator from "../../../__tests__/environment/Generator";
import {mountWithIntl} from "../../../__tests__/environment/Environment";
import {TermMetadata} from "../TermMetadata";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import Vocabulary from "../../../model/Vocabulary";
import OutgoingLink from "../../misc/OutgoingLink";
import {Button} from "reactstrap";
import VocabularyUtils from "../../../util/VocabularyUtils";
import {AssetLabel} from "../../misc/AssetLabel";

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
            comment: "test"
        });
    });

    it("renders sub terms as internal and external links", () => {
        const iri = Generator.generateUri();
        term.subTerms = [{iri}];
        const wrapper = mountWithIntl(<TermMetadata vocabulary={vocabulary} term={term} {...intlFunctions()}/>);
        const linkButton = wrapper.find(Button);
        expect(linkButton.length).toEqual(1);
        expect(linkButton.text()).toEqual(iri);
        expect(wrapper.find(OutgoingLink).filterWhere(x => x.text().indexOf(iri) !== -1).length).toEqual(1);
    });

    it("skips implicit term type when rendering types", () => {
        term.types = [VocabularyUtils.TERM, Generator.generateUri()];
        const wrapper = mountWithIntl(<TermMetadata vocabulary={vocabulary} term={term} {...intlFunctions()}/>);
        const renderedTypes = wrapper.find(AssetLabel);
        expect(renderedTypes.length).toEqual(1);
        expect(renderedTypes.text()).toEqual(term.types[1]);
    });
});