import * as React from 'react';
import {Button} from "reactstrap";
import Routing from '../../../util/Routing';
import {mountWithIntl} from "../../../__tests__/environment/Environment";
import {CreateVocabulary} from "../CreateVocabulary";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import Routes from "../../../util/Routes";
import Ajax, {params} from "../../../util/Ajax";
import Constants from "../../../util/Constants";
import Vocabulary from "../../../model/Vocabulary";

jest.mock('../../../util/Routing');
jest.mock('../../../util/Ajax');

describe('Create vocabulary view', () => {

    const iri = 'http://onto.fel.cvut.cz/ontologies/termit/vocabulary/test';

    let onCreate: (vocabulary: Vocabulary) => void;

    beforeEach(() => {
        Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(iri));
        onCreate = jest.fn();
    });

    it('returns to Vocabulary Management on cancel', () => {
        const wrapper = mountWithIntl(<CreateVocabulary onCreate={onCreate} {...intlFunctions()}/>);
        wrapper.find(Button).at(1).simulate('click');
        expect(Routing.transitionTo).toHaveBeenCalledWith(Routes.vocabularies);
    });

    it('enables submit button only when name is not empty', () => {
        const wrapper = mountWithIntl(<CreateVocabulary onCreate={onCreate}  {...intlFunctions()}/>);
        let submitButton = wrapper.find(Button).first();
        expect(submitButton.getElement().props.disabled).toBeTruthy();
        const nameInput = wrapper.find('input[name=\"create-vocabulary.name\"]');
        (nameInput.getDOMNode() as HTMLInputElement).value = 'Metropolitan Plan';
        nameInput.simulate('change', nameInput);
        submitButton = wrapper.find(Button).first();
        expect(submitButton.getElement().props.disabled).toBeFalsy();
    });

    it('calls onCreate on submit click', () => {
        const wrapper = mountWithIntl(<CreateVocabulary onCreate={onCreate}  {...intlFunctions()}/>);
        const nameInput = wrapper.find('input[name=\"create-vocabulary.name\"]');
        const name = 'Metropolitan Plan';
        (nameInput.getDOMNode() as HTMLInputElement).value = name;
        nameInput.simulate('change', nameInput);
        return Ajax.get(Constants.API_PREFIX + '/vocabularies/identifier').then(() => {
            const submitButton = wrapper.find(Button).first();
            submitButton.simulate('click');
            expect(onCreate).toHaveBeenCalledWith({label: name, iri});
        });
    });

    describe('IRI generation', () => {
        it('requests IRI generation when name changes', () => {
            const wrapper = mountWithIntl(<CreateVocabulary onCreate={onCreate}  {...intlFunctions()}/>);
            const nameInput = wrapper.find('input[name=\"create-vocabulary.name\"]');
            const name = 'Metropolitan Plan';
            (nameInput.getDOMNode() as HTMLInputElement).value = name;
            nameInput.simulate('change', nameInput);
            expect(Ajax.get).toHaveBeenCalledWith(Constants.API_PREFIX + '/vocabularies/identifier', params({name}));
        });

        it('does not request IRI generation when IRI value had been changed manually before', () => {
            const wrapper = mountWithIntl(<CreateVocabulary onCreate={onCreate}  {...intlFunctions()}/>);
            const iriInput = wrapper.find('input[name=\"create-vocabulary.iri\"]');
            (iriInput.getDOMNode() as HTMLInputElement).value = 'http://test';
            iriInput.simulate('change', iriInput);
            const nameInput = wrapper.find('input[name=\"create-vocabulary.name\"]');
            (nameInput.getDOMNode() as HTMLInputElement).value = 'Metropolitan Plan';
            nameInput.simulate('change', nameInput);
            expect(Ajax.get).not.toHaveBeenCalled();
        });

        it('displays IRI generated and returned by the server', () => {
            const wrapper = mountWithIntl(<CreateVocabulary onCreate={onCreate}  {...intlFunctions()}/>);
            const nameInput = wrapper.find('input[name=\"create-vocabulary.name\"]');
            (nameInput.getDOMNode() as HTMLInputElement).value = 'Metropolitan Plan';
            nameInput.simulate('change', nameInput);
            return Ajax.get(Constants.API_PREFIX + '/vocabularies/identifier').then(() => {
                const iriInput = wrapper.find('input[name=\"create-vocabulary.iri\"]');
                return expect((iriInput.getDOMNode() as HTMLInputElement).value).toEqual(iri);
            });
        });
    });
});