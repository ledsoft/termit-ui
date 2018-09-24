// import {Button} from "reactstrap";
// import Routing from '../../../util/Routing';
// import {i18n} from "../../../__tests__/environment/IntlUtil";
// import Routes from "../../../util/Routes";
// import Ajax from "../../../util/Ajax";
// import VocabularyTerm from "../../../model/VocabularyTerm";
// import {mountWithIntl} from "../../../__tests__/environment/Environment";
// import {CreateVocabularyTerm} from "../CreateVocabularyTerm";
// import FetchOptionsFunction from "../../../model/Functions";
//
// jest.mock('../../../util/Routing');
// jest.mock('../../../util/Ajax');
//
// describe('Create vocabulary term view', () => {
//
//    const iri = 'http://onto.fel.cvut.cz/ontologies/termit/vocabulary/test/term';
//
//     let onCreate: (term: VocabularyTerm, normalizedName: string) => void;
//     let fetchTerms: (fetchOptions: FetchOptionsFunction, normalizedName: string) => void;
//
//     beforeEach(() => {
//         Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(iri));
//         onCreate = jest.fn();
//     });
//
//     it('returns to Vocabulary Detail on cancel', () => {
//         const wrapper = mountWithIntl(<CreateVocabularyTerm  i18n = {i18n} onCreate={onCreate} fetchTerms={fetchTerms}/> );
//         wrapper.find(Button).at(1).simulate('click');
//         expect(Routing.transitionTo).toHaveBeenCalledWith(Routes.vocabularyDetail);
//     });
//
//     it('enables submit button only when name is not empty', () => {
//         const wrapper = mountWithIntl(<CreateVocabularyTerm i18n = {i18n} onCreate={onCreate} />);
//         let submitButton = wrapper.find(Button).first();
//         expect(submitButton.getElement().props.disabled).toBeTruthy();
//         const nameInput = wrapper.find('input[name=\"create-vocabulary.name\"]');
//         (nameInput.getDOMNode() as HTMLInputElement).value = 'Metropolitan Plan';
//         nameInput.simulate('change', nameInput);
//         submitButton = wrapper.find(Button).first();
//         expect(submitButton.getElement().props.disabled).toBeFalsy();
//     });
//
// });