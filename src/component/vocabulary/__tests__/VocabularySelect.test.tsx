import * as React from "react";
import {mount} from "enzyme";
import {EMPTY_VOCABULARY, default as Vocabulary} from "../../../model/Vocabulary";
import {VocabularySelect} from "../VocabularySelect";

describe("VocabularySelect", () => {

    let voc : Vocabulary;
    let onVocabularySet : (voc:Vocabulary) => void;
    let loadVocabularies : () => void;
    let vocabularies : { [key : string] : Vocabulary };


    beforeEach(() => {
        onVocabularySet = jest.fn();
        loadVocabularies = jest.fn().mockImplementation(() => {;} );
        voc = EMPTY_VOCABULARY;
        vocabularies = {};
        vocabularies[EMPTY_VOCABULARY.iri] = EMPTY_VOCABULARY;
    });

    it("VocabularySelect Dropdown is closed by default", () => {
        const wrapper = mount(<VocabularySelect
            vocabulary={voc}
            onVocabularySet={onVocabularySet}
            vocabularies={vocabularies}
            loadVocabularies={loadVocabularies}
        />);
        expect(wrapper.state("dropDownOpen")).toEqual(false);
    });
    it("VocabularySelect Dropdown Opens and Closes On Button Click", () => {
        const wrapper = mount(<VocabularySelect
            vocabulary={voc}
            onVocabularySet={onVocabularySet}
            vocabularies={vocabularies}
            loadVocabularies={loadVocabularies}
        />);
        wrapper.find("DropdownToggle").simulate("click");
        expect(wrapper.state("dropDownOpen")).toEqual(true);
        wrapper.find("DropdownToggle").simulate("click");
        expect(wrapper.state("dropDownOpen")).toEqual(false);
    });
    it("VocabularySelect Selection calls the callback", () => {
        const wrapper = mount(<VocabularySelect
            vocabulary={voc}
            onVocabularySet={onVocabularySet}
            vocabularies={vocabularies}
            loadVocabularies={loadVocabularies}
        />);
        wrapper.find("DropdownItem").simulate("click");
        expect(onVocabularySet).toHaveBeenCalled();
    });
});

