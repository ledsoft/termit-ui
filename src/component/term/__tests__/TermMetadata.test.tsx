import * as React from 'react';
import Term from "../../../model/Term";
import Generator from "../../../__tests__/environment/Generator";
import {intlDataForShallow, mountWithIntl} from "../../../__tests__/environment/Environment";
import {TermMetadata} from "../TermMetadata";
import {formatMessage, i18n} from "../../../__tests__/environment/IntlUtil";
import {Button} from "reactstrap";
import TermMetadataEdit from "../TermMetadataEdit";
import {shallow} from "enzyme";
import Vocabulary from "../../../model/Vocabulary";
import OutgoingLink from "../../misc/OutgoingLink";
import Routes from "../../../util/Routes";
import VocabularyUtils from "../../../util/VocabularyUtils";
import Routing from '../../../util/Routing';

jest.mock('../../../util/Routing');

describe('TermMetadata', () => {

    const vocabulary: Vocabulary = new Vocabulary({
        iri: Generator.generateUri(),
        label: 'Test vocabulary'
    });
    let term: Term;
    let updateTerm: (term: Term) => Promise<any>;
    let loadTerm: (term: Term, vocabulary: Vocabulary) => void;
    let reloadVocabularyTerms: (vocabulary: Vocabulary) => void;

    beforeEach(() => {
        term = new Term({
            iri: Generator.generateUri(),
            label: 'Test',
            comment: 'test'
        });
        updateTerm = jest.fn().mockImplementation(() => Promise.resolve());
        loadTerm = jest.fn();
        reloadVocabularyTerms = jest.fn();
    });

    it('renders term metadata by default', () => {
        const wrapper = mountWithIntl(<TermMetadata vocabulary={vocabulary} term={term} updateTerm={updateTerm} reloadVocabularyTerms={reloadVocabularyTerms}
                                                    loadTerm={loadTerm} i18n={i18n} formatMessage={formatMessage}/>);
        expect(wrapper.find('.attribute-label').length).toBeGreaterThan(1);
    });

    it('renders term editor after clicking edit button', () => {
        const wrapper = mountWithIntl(<TermMetadata vocabulary={vocabulary} term={term} updateTerm={updateTerm} reloadVocabularyTerms={reloadVocabularyTerms}
                                                    loadTerm={loadTerm} i18n={i18n} formatMessage={formatMessage}/>);
        wrapper.find(Button).simulate('click');
        expect(wrapper.find(TermMetadataEdit).exists()).toBeTruthy();
    });

    it('invokes termUpdate action on save', () => {
        const wrapper = shallow(<TermMetadata vocabulary={vocabulary} term={term} updateTerm={updateTerm} reloadVocabularyTerms={reloadVocabularyTerms}
                                              loadTerm={loadTerm} i18n={i18n}
                                              formatMessage={formatMessage} {...intlDataForShallow()}/>);
        (wrapper.instance() as TermMetadata).onSave(term);
        expect(updateTerm).toHaveBeenCalledWith(term, vocabulary);
    });

    it('closes term metadata edit on save success', () => {
        const wrapper = shallow(<TermMetadata vocabulary={vocabulary} term={term} updateTerm={updateTerm} reloadVocabularyTerms={reloadVocabularyTerms}
                                              loadTerm={loadTerm} i18n={i18n}
                                              formatMessage={formatMessage} {...intlDataForShallow()}/>);
        wrapper.find(Button).simulate('click');
        expect(wrapper.find(TermMetadataEdit).exists()).toBeTruthy();
        (wrapper.instance() as TermMetadata).onSave(term);
        return Promise.resolve().then(() => {
            wrapper.update();
            expect(wrapper.find(TermMetadataEdit).exists()).toBeFalsy();
        });
    });

    it('reloads term on successful save', () => {
        const wrapper = shallow(<TermMetadata vocabulary={vocabulary} term={term} updateTerm={updateTerm} reloadVocabularyTerms={reloadVocabularyTerms}
                                              loadTerm={loadTerm} i18n={i18n}
                                              formatMessage={formatMessage} {...intlDataForShallow()}/>);
        (wrapper.instance() as TermMetadata).onSave(term);
        return Promise.resolve().then(() => {
            expect(loadTerm).toHaveBeenCalledWith(term, vocabulary);
        });
    });

    it('closes edit when different term is selected', () => {
        const wrapper = shallow(<TermMetadata vocabulary={vocabulary} term={term} updateTerm={updateTerm} reloadVocabularyTerms={reloadVocabularyTerms}
                                              loadTerm={loadTerm} i18n={i18n}
                                              formatMessage={formatMessage} {...intlDataForShallow()}/>);
        wrapper.find(Button).simulate('click');
        expect(wrapper.find(TermMetadataEdit).exists()).toBeTruthy();
        const otherTerm = new Term({
            iri: Generator.generateUri(),
            label: 'Different term'
        });
        wrapper.setProps({term: otherTerm});
        wrapper.update();
        expect(wrapper.find(TermMetadataEdit).exists()).toBeFalsy();
    });

    it('renders sub terms as internal and external links', () => {
        const iri = Generator.generateUri();
        term.subTerms = [{iri}];
        const wrapper = mountWithIntl(<TermMetadata vocabulary={vocabulary} term={term} updateTerm={updateTerm} reloadVocabularyTerms={reloadVocabularyTerms}
                                                    loadTerm={loadTerm} i18n={i18n} formatMessage={formatMessage}/>);
        expect(wrapper.find('button[children="' + iri + '"]').length).toEqual(1);
        expect(wrapper.find(OutgoingLink).filterWhere(x => x.text().indexOf(iri) !== -1).length).toEqual(1);
    });

    it('transitions to term detail when sub term internal link is clicked', () => {
        const iri = Generator.generateUri();
        term.subTerms = [{iri}];
        const wrapper = mountWithIntl(<TermMetadata vocabulary={vocabulary} term={term} updateTerm={updateTerm} reloadVocabularyTerms={reloadVocabularyTerms}
                                                    loadTerm={loadTerm} i18n={i18n} formatMessage={formatMessage}/>);
        const subTermLink = wrapper.find('button[children="' + iri + '"]');
        expect(subTermLink.length).toEqual(1);
        subTermLink.simulate('click');
        expect(Routing.transitionTo).toHaveBeenCalledWith(Routes.vocabularyTermDetail, {
            params: new Map([['name', VocabularyUtils.getFragment(vocabulary.iri)], ['termName', VocabularyUtils.getFragment(iri)]])
        });
    });

    it('reloads vocabulary terms on successful save', () => {
        const wrapper = shallow(<TermMetadata vocabulary={vocabulary} term={term} updateTerm={updateTerm} reloadVocabularyTerms={reloadVocabularyTerms}
                                              loadTerm={loadTerm} i18n={i18n}
                                              formatMessage={formatMessage} {...intlDataForShallow()}/>);
        (wrapper.instance() as TermMetadata).onSave(term);
        return Promise.resolve().then(() => {
            expect(reloadVocabularyTerms).toHaveBeenCalledWith(vocabulary);
        });
    });
});