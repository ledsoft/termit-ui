import * as React from 'react';
import Term from "../../../model/Term";
import Generator from "../../../__tests__/environment/Generator";
import {mountWithIntl} from "../../../__tests__/environment/Environment";
import {TermMetadataEdit} from "../TermMetadataEdit";
import {formatMessage, i18n} from "../../../__tests__/environment/IntlUtil";

describe('Term edit', () => {

    let term: Term;
    let onSave: (t:Term) => void;
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
        const wrapper = mountWithIntl(<TermMetadataEdit save={onSave} i18n={i18n} term={term} cancel={onCancel} formatMessage={formatMessage}/>);
        const idInput = wrapper.find('input[name="iri"]');
        (idInput.getDOMNode() as HTMLInputElement).value = '';
        idInput.simulate('change', idInput);
        const saveButton = wrapper.find('[color="success"]');
        expect(saveButton.getElement().props.disabled).toBeTruthy();
    });

    it('disables save button when label field is empty', () => {
        const wrapper = mountWithIntl(<TermMetadataEdit save={onSave} i18n={i18n} term={term} cancel={onCancel} formatMessage={formatMessage}/>);
        const labelInput = wrapper.find('input[name="label"]');
        (labelInput.getDOMNode() as HTMLInputElement).value = '';
        labelInput.simulate('change', labelInput);
        const saveButton = wrapper.find('[color="success"]');
        expect(saveButton.getElement().props.disabled).toBeTruthy();
    });

    it('invokes save with state data when save is clicked', () => {
        const wrapper = mountWithIntl(<TermMetadataEdit save={onSave} i18n={i18n} term={term} cancel={onCancel} formatMessage={formatMessage}/>);
        const newLabel = 'New label';
        const labelInput = wrapper.find('input[name="label"]');
        (labelInput.getDOMNode() as HTMLInputElement).value = newLabel;
        labelInput.simulate('change', labelInput);
        wrapper.find('[color="success"]').simulate('click');
        expect(onSave).toHaveBeenCalled();
        const arg = (onSave as jest.Mock).mock.calls[0][0];
        expect(arg.iri).toEqual(term.iri);
        expect(arg.label).toEqual(newLabel);
        expect(arg.comment).toEqual(term.comment);
    });
});