import * as React from 'react';
import {VocabularyEdit} from "../VocabularyEdit";
import Vocabulary from "../../../model/Vocabulary";
import Generator from "../../../__tests__/environment/Generator";
import {intlDataForShallow, mountWithIntl} from "../../../__tests__/environment/Environment";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import {shallow} from "enzyme";

describe('VocabularyEdit', () => {

    let onSave: (vocabulary: Vocabulary) => void;
    let onCancel: () => void;
    let vocabulary: Vocabulary;

    beforeEach(() => {
        onSave = jest.fn();
        onCancel = jest.fn();
        vocabulary = new Vocabulary({
            iri: Generator.generateUri(),
            label: 'Test vocabulary'
        });
    });

    it('passes updated vocabulary to onSave', () => {
        const wrapper = mountWithIntl(<VocabularyEdit vocabulary={vocabulary} save={onSave} cancel={onCancel}
                                                      {...intlFunctions()}/>);
        const nameInput = wrapper.find('input[name="vocabulary-edit-label"]');
        const newName = 'Metropolitan plan';
        (nameInput.getDOMNode() as HTMLInputElement).value = newName;
        nameInput.simulate('change', nameInput);
        wrapper.find('.btn-success').simulate('click');
        expect(onSave).toHaveBeenCalled();
        const arg = (onSave as jest.Mock).mock.calls[0][0];
        expect(arg).not.toEqual(vocabulary);
        expect(arg.iri).toEqual(vocabulary.iri);
        expect(arg.label).toEqual(newName);
    });

    it('closes editing view on when clicking on cancel', () => {
        const wrapper = mountWithIntl(<VocabularyEdit vocabulary={vocabulary} save={onSave} cancel={onCancel}
                                                      {...intlFunctions()}/>);
        wrapper.find('.btn-secondary').simulate('click');
        expect(onCancel).toHaveBeenCalled();
    });

    it("correctly sets unmapped properties on save", () => {
        const property = Generator.generateUri();
        vocabulary.unmappedProperties = new Map([[property, ["test"]]]);
        const wrapper = shallow(<VocabularyEdit vocabulary={vocabulary} save={onSave}
                                                cancel={onCancel} {...intlFunctions()} {...intlDataForShallow()}/>);
        const updatedProperties = new Map([[property, ["test1", "test2"]]]);
        wrapper.instance().setState({unmappedProperties: updatedProperties});
        (wrapper.instance() as VocabularyEdit).onSave();
        const result: Vocabulary = (onSave as jest.Mock).mock.calls[0][0];
        expect(result.unmappedProperties).toEqual(updatedProperties);
        expect(result[property]).toBeDefined();
        expect(result[property]).toEqual(updatedProperties.get(property));
    });
});