import * as React from 'react';
import Generator from "../../../__tests__/environment/Generator";
import Vocabulary from "../../../model/Vocabulary";
import {shallow} from "enzyme";
import {VocabularyMetadata} from "../VocabularyMetadata";
import {formatMessage, i18n} from "../../../__tests__/environment/IntlUtil";
import {intlDataForShallow, mountWithIntl} from "../../../__tests__/environment/Environment";
import {EditVocabulary} from "../EditVocabulary";
import {Button} from "reactstrap";

describe('VocabularyMetadata', () => {

    let vocabulary: Vocabulary;
    let updateVocabulary: (vocabulary: Vocabulary) => Promise<any>;

    beforeEach(() => {
        vocabulary = new Vocabulary({
            iri: Generator.generateUri(),
            label: 'Test vocabulary',
            author: {
                iri: Generator.generateUri(),
                firstName: 'Catherine',
                lastName: 'Halsey',
                username: 'halsey@unsc.org'
            }
        });
        updateVocabulary = jest.fn().mockImplementation(() => Promise.resolve());
    });

    it('renders editing UI after clicking on edit button', () => {
        const wrapper = mountWithIntl(<VocabularyMetadata vocabulary={vocabulary} update={updateVocabulary} i18n={i18n}
                                                          formatMessage={formatMessage}/>);
        expect(wrapper.find(EditVocabulary).exists()).toBeFalsy();
        const editButton = wrapper.find(Button);
        editButton.simulate('click');
        expect(wrapper.find(EditVocabulary).exists()).toBeTruthy();
    });

    it('invokes vocabulary update on edit save', () => {
        const wrapper = shallow(<VocabularyMetadata vocabulary={vocabulary} update={updateVocabulary} i18n={i18n}
                                                    formatMessage={formatMessage} {...intlDataForShallow()}/>);
        const update = new Vocabulary({
            iri: vocabulary.iri,
            label: 'Updated',
            author: vocabulary.author
        });
        (wrapper.instance() as VocabularyMetadata).onSave(update);
        expect(updateVocabulary).toHaveBeenCalledWith(update);
    });

    it('closes editing UI on successful update', () => {
        const wrapper = shallow(<VocabularyMetadata vocabulary={vocabulary} update={updateVocabulary} i18n={i18n}
                                                    formatMessage={formatMessage} {...intlDataForShallow()}/>);
        (wrapper.instance() as VocabularyMetadata).onEdit();
        (wrapper.instance() as VocabularyMetadata).onSave(vocabulary);
        (wrapper.instance() as VocabularyMetadata).onCloseEdit = jest.fn();
        return Promise.resolve().then(() => {
            expect((wrapper.instance() as VocabularyMetadata).onCloseEdit).toHaveBeenCalled();
        });
    });
});