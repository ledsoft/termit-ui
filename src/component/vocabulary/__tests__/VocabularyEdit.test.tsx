import * as React from 'react';
import {VocabularyEdit} from "../VocabularyEdit";
import Vocabulary from "../../../model/Vocabulary";
import Generator from "../../../__tests__/environment/Generator";
import {mountWithIntl} from "../../../__tests__/environment/Environment";
import {formatMessage, i18n} from "../../../__tests__/environment/IntlUtil";

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
                                                      i18n={i18n} formatMessage={formatMessage}/>);
        const nameInput = wrapper.find('input[name="vocabulary-edit-name"]');
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
                                                      i18n={i18n} formatMessage={formatMessage}/>);
        wrapper.find('.btn-secondary').simulate('click');
        expect(onCancel).toHaveBeenCalled();
    });
});