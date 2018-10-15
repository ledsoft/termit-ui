import * as React from 'react';
import Term from "../../../model/Term";
import Generator from "../../../__tests__/environment/Generator";
import {mountWithIntl} from "../../../__tests__/environment/Environment";
import {TermMetadataEdit} from "../TermMetadataEdit";
import {formatMessage, i18n} from "../../../__tests__/environment/IntlUtil";
import Vocabulary from "../../../model/Vocabulary";
import Ajax from "../../../util/Ajax";

describe('Term edit', () => {

    const vocabulary = new Vocabulary({
        iri: Generator.generateUri(),
        label: 'Test vocabulary'
    });
    let term: Term;
    let onSave: (t: Term) => void;
    let onCancel: () => void;

    beforeEach(() => {
        term = new Term({
            iri: Generator.generateUri(),
            label: 'Test',
            comment: 'test'
        });
        onSave = jest.fn();
        onCancel = jest.fn();
    });

    it('disables save button when identifier field is empty', () => {
        const wrapper = mountWithIntl(<TermMetadataEdit save={onSave} i18n={i18n} term={term} vocabulary={vocabulary}
                                                        cancel={onCancel} formatMessage={formatMessage}/>);
        const idInput = wrapper.find('input[name="iri"]');
        (idInput.getDOMNode() as HTMLInputElement).value = '';
        idInput.simulate('change', idInput);
        const saveButton = wrapper.find('[color="success"]').last();
        expect(saveButton.getElement().props.disabled).toBeTruthy();
    });

    it('disables save button when label field is empty', () => {
        const wrapper = mountWithIntl(<TermMetadataEdit save={onSave} i18n={i18n} term={term} vocabulary={vocabulary}
                                                        cancel={onCancel} formatMessage={formatMessage}/>);
        const labelInput = wrapper.find('input[name="label"]');
        (labelInput.getDOMNode() as HTMLInputElement).value = '';
        labelInput.simulate('change', labelInput);
        const saveButton = wrapper.find('[color="success"]').last();
        expect(saveButton.getElement().props.disabled).toBeTruthy();
    });

    it('invokes save with state data when save is clicked', () => {
        const wrapper = mountWithIntl(<TermMetadataEdit save={onSave} i18n={i18n} term={term} vocabulary={vocabulary}
                                                        cancel={onCancel} formatMessage={formatMessage}/>);
        const newLabel = 'New label';
        const labelInput = wrapper.find('input[name="label"]');
        (labelInput.getDOMNode() as HTMLInputElement).value = newLabel;
        labelInput.simulate('change', labelInput);
        wrapper.find('[color="success"]').last().simulate('click');
        expect(onSave).toHaveBeenCalled();
        const arg = (onSave as jest.Mock).mock.calls[0][0];
        expect(arg.iri).toEqual(term.iri);
        expect(arg.label).toEqual(newLabel);
        expect(arg.comment).toEqual(term.comment);
    });

    it('checks for label uniqueness in vocabulary on label change', () => {
        const wrapper = mountWithIntl(<TermMetadataEdit save={onSave} i18n={i18n} term={term} vocabulary={vocabulary}
                                                        cancel={onCancel} formatMessage={formatMessage}/>);
        const mock = jest.fn().mockImplementation(() => Promise.resolve(true));
        Ajax.get = mock;
        const newLabel = 'New label';
        const labelInput = wrapper.find('input[name="label"]');
        (labelInput.getDOMNode() as HTMLInputElement).value = newLabel;
        labelInput.simulate('change', labelInput);
        return Promise.resolve().then(() => {
            expect(Ajax.get).toHaveBeenCalled();
            expect(mock.mock.calls[0][1].getParams().label).toEqual(newLabel);
        });
    });

    it('does not check for label uniqueness when new label is the same as original', () => {
        const wrapper = mountWithIntl(<TermMetadataEdit save={onSave} i18n={i18n} term={term} vocabulary={vocabulary}
                                                        cancel={onCancel} formatMessage={formatMessage}/>);
        Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(true));
        const labelInput = wrapper.find('input[name="label"]');
        (labelInput.getDOMNode() as HTMLInputElement).value = term.label;
        labelInput.simulate('change', labelInput);
        expect(Ajax.get).not.toHaveBeenCalled();
    });

    it('disables save button when duplicate label is set', () => {
        const wrapper = mountWithIntl(<TermMetadataEdit save={onSave} i18n={i18n} term={term} vocabulary={vocabulary}
                                                        cancel={onCancel} formatMessage={formatMessage}/>);
        Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(true));
        const newLabel = 'New label';
        const labelInput = wrapper.find('input[name="label"]');
        (labelInput.getDOMNode() as HTMLInputElement).value = newLabel;
        labelInput.simulate('change', labelInput);
        return Promise.resolve().then(() => {
            wrapper.update();
            const saveButton = wrapper.find('[color="success"]').last();
            expect(saveButton.getElement().props.disabled).toBeTruthy();
        });
    });
});