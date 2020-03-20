import * as React from "react";
import Vocabulary, {EMPTY_VOCABULARY} from "../../../model/Vocabulary";
import Document from "../../../model/Document";
import Generator from "../../../__tests__/environment/Generator";
import VocabularyUtils from "../../../util/VocabularyUtils";
import {VocabularyMetadata} from "../VocabularyMetadata";
import {shallow} from "enzyme";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import ResourceLink from "../../resource/ResourceLink";

describe("VocabularyMetadata", () => {

    let onFileAdded: () => void;

    let vocabulary: Vocabulary;

    beforeEach(() => {
        onFileAdded = jest.fn();
        vocabulary = vocabulary = new Vocabulary({
            iri: Generator.generateUri(),
            label: "Test vocabulary",
            types: [VocabularyUtils.VOCABULARY]
        });
    });

    it("renders link to document associated with vocabulary when it is present", () => {
        vocabulary.document = new Document({
            iri: Generator.generateUri(),
            label: "Test document",
            files: [],
            types: [VocabularyUtils.RESOURCE, VocabularyUtils.DOCUMENT]
        });
        const wrapper = shallow(<VocabularyMetadata vocabulary={vocabulary}
                                                    onFileAdded={onFileAdded} {...intlFunctions()}/>);
        expect(wrapper.exists(ResourceLink)).toBeTruthy();
    });

    it("sets selected tab to document files tab if vocabulary has document on mount", () => {
        vocabulary.document = new Document({
            iri: Generator.generateUri(),
            label: "Test document",
            files: [],
            types: [VocabularyUtils.RESOURCE, VocabularyUtils.DOCUMENT]
        });
        const wrapper = shallow<VocabularyMetadata>(<VocabularyMetadata vocabulary={vocabulary}
                                                    onFileAdded={onFileAdded} {...intlFunctions()}/>);
        expect(wrapper.state().activeTab).toEqual("vocabulary.detail.files");
    });

    it("sets selected tab to unmapped properties if vocabulary does not have document on mount", () => {
        const wrapper = shallow<VocabularyMetadata>(<VocabularyMetadata vocabulary={vocabulary}
                                                                        onFileAdded={onFileAdded} {...intlFunctions()}/>);
        expect(wrapper.state().activeTab).toEqual("properties.edit.title");
    });

    it("switches selected to to document files when vocabulary changes to a one with document", () => {
        const wrapper = shallow<VocabularyMetadata>(<VocabularyMetadata vocabulary={EMPTY_VOCABULARY}
                                                                        onFileAdded={onFileAdded} {...intlFunctions()}/>);
        expect(wrapper.state().activeTab).toEqual("properties.edit.title");
        vocabulary.document = new Document({
            iri: Generator.generateUri(),
            label: "Test document",
            files: [],
            types: [VocabularyUtils.RESOURCE, VocabularyUtils.DOCUMENT]
        });
        wrapper.setProps({vocabulary});
        wrapper.update();
        expect(wrapper.state().activeTab).toEqual("vocabulary.detail.files");
    });
});
