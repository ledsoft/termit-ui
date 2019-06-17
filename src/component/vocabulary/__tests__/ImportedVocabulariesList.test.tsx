import * as React from "react";
import {shallow} from "enzyme";
import {ImportedVocabulariesList} from "../ImportedVocabulariesList";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import {intlDataForShallow} from "../../../__tests__/environment/Environment";
import Generator from "../../../__tests__/environment/Generator";
import VocabularyIriLink from "../VocabularyIriLink";

describe("ImportedVocabulariesList", () => {

    it("renders nothing when no imported vocabularies are provided", () => {
        const wrapper = shallow(<ImportedVocabulariesList {...intlFunctions()} {...intlDataForShallow()}/>);
        expect(wrapper.isEmptyRender()).toBeTruthy();
    });

    it("renders links to provided vocabularies", () => {
        const vocabularies = [{
            iri: Generator.generateUri(),
        }, {
            iri: Generator.generateUri()
        }];
        const wrapper = shallow(<ImportedVocabulariesList vocabularies={vocabularies} {...intlFunctions()} {...intlDataForShallow()}/>);
        expect(wrapper.find(VocabularyIriLink).length).toEqual(2);
    });
});