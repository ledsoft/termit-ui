import * as React from "react";
import Vocabulary from "../../../model/Vocabulary";
import Document from "../../../model/Document";
import Generator from "../../../__tests__/environment/Generator";
import VocabularyUtils from "../../../util/VocabularyUtils";
import {VocabularyMetadata} from "../VocabularyMetadata";
import {shallow} from "enzyme";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import ResourceLink from "../../resource/ResourceLink";

describe("VocabularyMetadata", () => {

    let onFileAdded: () => void;

    beforeEach(() => {
        onFileAdded = jest.fn();
    });

    it("renders link to document associated with vocabulary when it is present", () => {
        const vocabulary = new Vocabulary({
            iri: Generator.generateUri(),
            label: "Test vocabulary",
            types: [VocabularyUtils.VOCABULARY],
            document: new Document({
                iri: Generator.generateUri(),
                label: "Test document",
                files: [],
                types: [VocabularyUtils.RESOURCE, VocabularyUtils.DOCUMENT]
            })
        });
        const wrapper = shallow(<VocabularyMetadata vocabulary={vocabulary}
                                                    onFileAdded={onFileAdded} {...intlFunctions()}/>);
        expect(wrapper.exists(ResourceLink)).toBeTruthy();
    });
});
