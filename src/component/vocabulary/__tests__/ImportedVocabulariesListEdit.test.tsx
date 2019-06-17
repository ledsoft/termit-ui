import * as React from "react";
import Vocabulary from "../../../model/Vocabulary";
import Generator from "../../../__tests__/environment/Generator";
import VocabularyUtils from "../../../util/VocabularyUtils";
import {shallow} from "enzyme";
import {ImportedVocabulariesListEdit} from "../ImportedVocabulariesListEdit";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import {intlDataForShallow} from "../../../__tests__/environment/Environment";
// @ts-ignore
import {IntelligentTreeSelect} from "intelligent-tree-select";

describe("ImportedVocabulariesListEdit", () => {

    let vocabularies: { [key: string]: Vocabulary };

    let onChange: (change: object) => void;

    beforeEach(() => {
        const vOne = new Vocabulary({
            iri: Generator.generateUri(),
            label: "Vocabulary One",
            types: [VocabularyUtils.VOCABULARY]
        });
        const vTwo = new Vocabulary({
            iri: Generator.generateUri(),
            label: "Vocabulary two",
            types: [VocabularyUtils.VOCABULARY]
        });
        vocabularies = {};
        vocabularies[vOne.iri] = vOne;
        vocabularies[vTwo.iri] = vTwo;
        onChange = jest.fn();
    });

    it("renders select without any value when no imported vocabularies are specified", () => {
        const wrapper = shallow(<ImportedVocabulariesListEdit vocabularies={vocabularies}
                                                              onChange={onChange} {...intlFunctions()} {...intlDataForShallow()}/>);
        expect(wrapper.find(IntelligentTreeSelect).prop("value")).toEqual([]);
    });

    it("calls onChange with selected vocabularies IRIs on vocabulary selection", () => {
        const vocabularyArray = Object.keys(vocabularies).map((v) => vocabularies[v]);
        const wrapper = shallow<ImportedVocabulariesListEdit>(<ImportedVocabulariesListEdit vocabularies={vocabularies}
                                                                                            onChange={onChange} {...intlFunctions()} {...intlDataForShallow()}/>);
        wrapper.instance().onChange(vocabularyArray);
        expect(onChange).toHaveBeenCalledWith({importedVocabularies: vocabularyArray.map(v => ({iri: v.iri}))});
    });

    it("calls onChange with empty array when vocabulary selector is reset", () => {
        const selected = Object.keys(vocabularies).map(k => ({iri: k}));
        const wrapper = shallow<ImportedVocabulariesListEdit>(<ImportedVocabulariesListEdit vocabularies={vocabularies}
                                                                                            importedVocabularies={selected}
                                                                                            onChange={onChange} {...intlFunctions()} {...intlDataForShallow()}/>);
        wrapper.instance().onChange([]);
        expect(onChange).toHaveBeenCalledWith({importedVocabularies: []});
    });

    it("updates vocabulary selection when props are updated", () => {
        const wrapper = shallow<ImportedVocabulariesListEdit>(<ImportedVocabulariesListEdit vocabularies={vocabularies}
                                                                                            onChange={onChange} {...intlFunctions()} {...intlDataForShallow()}/>);
        expect(wrapper.find(IntelligentTreeSelect).prop("value")).toEqual([]);
        const newSelected = [{iri: Object.keys(vocabularies)[0]}];
        wrapper.setProps({importedVocabularies: newSelected});
        wrapper.update();
        expect(wrapper.find(IntelligentTreeSelect).prop("value")).toEqual([newSelected[0].iri]);
    });
});