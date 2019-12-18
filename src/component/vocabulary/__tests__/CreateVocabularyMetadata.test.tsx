import * as React from "react";
import {Button} from "reactstrap";
import {mountWithIntl} from "../../../__tests__/environment/Environment";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import Ajax, {params} from "../../../util/Ajax";
import Constants from "../../../util/Constants";
import Vocabulary from "../../../model/Vocabulary";
import {shallow} from "enzyme";
import {CreateVocabularyMetadata} from "../CreateVocabularyMetadata";

jest.mock("../../../util/Routing");
jest.mock("../../../util/Ajax", () => ({
    default: jest.fn(),
    content: require.requireActual("../../../util/Ajax").content,
    params: require.requireActual("../../../util/Ajax").params,
    param: require.requireActual("../../../util/Ajax").param,
    accept: require.requireActual("../../../util/Ajax").accept,
}));

describe("Create vocabulary metadata view", () => {

    const iri = "http://onto.fel.cvut.cz/ontologies/termit/vocabulary/test";

    let onCreate: (vocabulary: Vocabulary) => void;
    let onCancel: () => void;

    beforeEach(() => {
        Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(iri));
        onCreate = jest.fn();
        onCancel = jest.fn();
    });

    it("enables submit button only when name is not empty", () => {
        const wrapper = mountWithIntl(<CreateVocabularyMetadata onCreate={onCreate} onCancel={onCancel} {...intlFunctions()}/>);
        let submitButton = wrapper.find(Button).first();
        expect(submitButton.getElement().props.disabled).toBeTruthy();
        const nameInput = wrapper.find("input[name=\"create-vocabulary-label\"]");
        (nameInput.getDOMNode() as HTMLInputElement).value = "Metropolitan Plan";
        nameInput.simulate("change", nameInput);
        submitButton = wrapper.find(Button).first();
        expect(submitButton.getElement().props.disabled).toBeFalsy();
    });

    it("calls onCreate on submit click", () => {
        const wrapper = mountWithIntl(<CreateVocabularyMetadata onCreate={onCreate} onCancel={onCancel} {...intlFunctions()}/>);
        const nameInput = wrapper.find("input[name=\"create-vocabulary-label\"]");
        (nameInput.getDOMNode() as HTMLInputElement).value = "Metropolitan Plan";
        nameInput.simulate("change", nameInput);
        return Ajax.get(Constants.API_PREFIX + "/vocabularies/identifier").then(() => {
            const submitButton = wrapper.find(Button).first();
            submitButton.simulate("click");
            expect(onCreate).toHaveBeenCalled();
        });
    });

    it("passes state representing new vocabulary to vocabulary creation handler on submit", () => {
        const wrapper = shallow<CreateVocabularyMetadata>(<CreateVocabularyMetadata onCreate={onCreate} onCancel={onCancel} {...intlFunctions()}/>);
        const label = "Test vocabulary";
        const comment = "Test vocabulary comment";
        wrapper.setState({iri, label, comment});
        wrapper.update();
        (wrapper.instance()).onCreate();
        expect(onCreate).toHaveBeenCalledWith(new Vocabulary({iri, label, comment}));
    });

    describe("IRI generation", () => {
        it("requests IRI generation when name changes", () => {
            const wrapper = mountWithIntl(<CreateVocabularyMetadata onCreate={onCreate} onCancel={onCancel}  {...intlFunctions()}/>);
            const nameInput = wrapper.find("input[name=\"create-vocabulary-label\"]");
            const name = "Metropolitan Plan";
            (nameInput.getDOMNode() as HTMLInputElement).value = name;
            nameInput.simulate("change", nameInput);
            return Promise.resolve().then(() => {
                expect(Ajax.get).toHaveBeenCalledWith(Constants.API_PREFIX + "/vocabularies/identifier", params({name}));
            });
        });

        it("does not request IRI generation when IRI value had been changed manually before", () => {
            const wrapper = mountWithIntl(<CreateVocabularyMetadata onCreate={onCreate} onCancel={onCancel} {...intlFunctions()}/>);
            const iriInput = wrapper.find("input[name=\"create-vocabulary-iri\"]");
            (iriInput.getDOMNode() as HTMLInputElement).value = "http://test";
            iriInput.simulate("change", iriInput);
            const nameInput = wrapper.find("input[name=\"create-vocabulary-label\"]");
            (nameInput.getDOMNode() as HTMLInputElement).value = "Metropolitan Plan";
            nameInput.simulate("change", nameInput);
            expect(Ajax.get).not.toHaveBeenCalled();
        });

        it("displays IRI generated and returned by the server", () => {
            const wrapper = mountWithIntl(<CreateVocabularyMetadata onCreate={onCreate} onCancel={onCancel} {...intlFunctions()}/>);
            const nameInput = wrapper.find("input[name=\"create-vocabulary-label\"]");
            (nameInput.getDOMNode() as HTMLInputElement).value = "Metropolitan Plan";
            nameInput.simulate("change", nameInput);
            return Ajax.get(Constants.API_PREFIX + "/vocabularies/identifier").then(() => {
                const iriInput = wrapper.find("input[name=\"create-vocabulary-iri\"]");
                return expect((iriInput.getDOMNode() as HTMLInputElement).value).toEqual(iri);
            });
        });
    });
});
