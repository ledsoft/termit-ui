import * as React from 'react';
import {Location} from 'history';
import {match as Match} from 'react-router';
import createMemoryHistory from "history/createMemoryHistory";
import {shallow} from "enzyme";
import {TermDetail} from "../TermDetail";
import {intlDataForShallow, mountWithIntl} from "../../../__tests__/environment/Environment";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import TermMetadata from "../TermMetadata";
import {Button} from "reactstrap";
import TermMetadataEdit from "../TermMetadataEdit";
import Term from "../../../model/Term";
import Generator from "../../../__tests__/environment/Generator";
import Vocabulary from "../../../model/Vocabulary";
import AppNotification from "../../../model/AppNotification";
import NotificationType from "../../../model/NotificationType";

jest.mock("../TermAssignments");

describe('TermDetail', () => {

    const normalizedTermName = 'test-term';
    const normalizedVocabName = 'test-vocabulary';

    let location: Location;
    const history = createMemoryHistory();
    let match: Match<any>;

    let onLoad: (termName: string, vocabName: string, namespace?: string) => void;
    let onUpdate: (term: Term, vocabulary: Vocabulary) => Promise<any>;
    let onLoadTerms: (normalizedName: string, namespace?: string) => void;
    let onPublishNotification: (notification: AppNotification) => void;

    let term: Term;
    let vocabulary: Vocabulary;

    beforeEach(() => {
        location = {
            pathname: '/vocabulary/' + normalizedVocabName + '/term/' + normalizedTermName,
            search: '',
            hash: '',
            state: {}
        };
        match = {
            params: {
                name: normalizedVocabName,
                termName: normalizedTermName
            },
            path: location.pathname,
            isExact: true,
            url: 'http://localhost:3000/' + location.pathname
        };
        onLoad = jest.fn();
        onUpdate = jest.fn().mockImplementation(() => Promise.resolve());
        onLoadTerms = jest.fn();
        onPublishNotification = jest.fn();
        term = new Term({
            iri: Generator.generateUri(),
            label: 'Test term'
        });
        vocabulary = new Vocabulary({
            iri: Generator.generateUri(),
            label: 'Test vocabulary'
        });
    });

    it('loads term on mount', () => {
        shallow(<TermDetail term={null} vocabulary={null} loadTerm={onLoad} updateTerm={onUpdate}
                            reloadVocabularyTerms={onLoadTerms} publishNotification={onPublishNotification}
                            history={history} location={location} match={match}
                            {...intlFunctions()} {...intlDataForShallow()}/>);
        expect(onLoad).toHaveBeenCalledWith(normalizedTermName, normalizedVocabName, undefined);
    });

    it('provides namespace to term loading when specified in url', () => {
        const namespace = 'http://onto.fel.cvut.cz/ontologies/termit/vocabularies/';
        location.search = '?namespace=' + namespace;
        shallow(<TermDetail term={null} vocabulary={null} loadTerm={onLoad} updateTerm={onUpdate}
                            reloadVocabularyTerms={onLoadTerms} history={history}
                            location={location} match={match} publishNotification={onPublishNotification}
                            {...intlFunctions()} {...intlDataForShallow()}/>);
        expect(onLoad).toHaveBeenCalledWith(normalizedTermName, normalizedVocabName, namespace);
    });

    it('renders term metadata by default', () => {
        const wrapper = mountWithIntl(<TermDetail term={term} vocabulary={vocabulary} loadTerm={onLoad}
                                                  updateTerm={onUpdate} publishNotification={onPublishNotification}
                                                  reloadVocabularyTerms={onLoadTerms} history={history}
                                                  location={location} match={match}
                                                  {...intlFunctions()}/>);
        expect(wrapper.find(TermMetadata).exists()).toBeTruthy();
    });

    it('renders term editor after clicking edit button', () => {
        const wrapper = mountWithIntl(<TermDetail term={term} vocabulary={vocabulary} loadTerm={onLoad}
                                                  updateTerm={onUpdate} publishNotification={onPublishNotification}
                                                  reloadVocabularyTerms={onLoadTerms} history={history}
                                                  location={location} match={match}
                                                  {...intlFunctions()}/>);
        wrapper.find(Button).simulate('click');
        expect(wrapper.find(TermMetadataEdit).exists()).toBeTruthy();
    });

    it('invokes termUpdate action on save', () => {
        const wrapper = shallow(<TermDetail term={term} vocabulary={vocabulary} loadTerm={onLoad} updateTerm={onUpdate}
                                            reloadVocabularyTerms={onLoadTerms} history={history}
                                            location={location} match={match}
                                            publishNotification={onPublishNotification}
                                            {...intlFunctions()} {...intlDataForShallow()}/>);
        (wrapper.instance() as TermDetail).onSave(term);
        expect(onUpdate).toHaveBeenCalledWith(term, vocabulary);
    });

    it('closes term metadata edit on save success', () => {
        const wrapper = shallow(<TermDetail term={term} vocabulary={vocabulary} loadTerm={onLoad}
                                            updateTerm={onUpdate} publishNotification={onPublishNotification}
                                            reloadVocabularyTerms={onLoadTerms} history={history}
                                            location={location} match={match}
                                            {...intlFunctions()} {...intlDataForShallow()}/>);
        (wrapper.instance() as TermDetail).onEdit();
        (wrapper.instance() as TermDetail).onSave(term);
        return Promise.resolve().then(() => {
            wrapper.update();
            expect((wrapper.instance() as TermDetail).state.edit).toBeFalsy();
        });
    });

    it('reloads term on successful save', () => {
        const wrapper = shallow(<TermDetail term={term} vocabulary={vocabulary} loadTerm={onLoad} updateTerm={onUpdate}
                                            reloadVocabularyTerms={onLoadTerms} history={history}
                                            location={location} match={match}
                                            publishNotification={onPublishNotification}
                                            {...intlFunctions()} {...intlDataForShallow()}/>);
        (wrapper.instance() as TermDetail).onSave(term);
        return Promise.resolve().then(() => {
            expect(onLoad).toHaveBeenCalledWith(normalizedTermName, normalizedVocabName, undefined);
        });
    });

    it('closes edit when different term is selected', () => {
        const wrapper = shallow(<TermDetail term={term} vocabulary={vocabulary} loadTerm={onLoad} updateTerm={onUpdate}
                                            reloadVocabularyTerms={onLoadTerms} history={history}
                                            location={location} match={match}
                                            publishNotification={onPublishNotification}
                                            {...intlFunctions()} {...intlDataForShallow()}/>);
        (wrapper.instance() as TermDetail).onEdit();
        wrapper.update();
        expect((wrapper.instance() as TermDetail).state.edit).toBeTruthy();
        const newMatch = {
            params: {
                name: normalizedVocabName,
                termName: 'differentTerm'
            },
            path: '/different',
            isExact: true,
            url: 'http://localhost:3000/different'
        };
        wrapper.setProps({match: newMatch});
        wrapper.update();
        expect((wrapper.instance() as TermDetail).state.edit).toBeFalsy();
    });

    it('reloads vocabulary terms on successful save', () => {
        const wrapper = shallow(<TermDetail term={term} vocabulary={vocabulary} loadTerm={onLoad} updateTerm={onUpdate}
                                            reloadVocabularyTerms={onLoadTerms} history={history}
                                            location={location} match={match}
                                            publishNotification={onPublishNotification}
                                            {...intlFunctions()} {...intlDataForShallow()}/>);
        (wrapper.instance() as TermDetail).onSave(term);
        return Promise.resolve().then(() => {
            expect(onLoadTerms).toHaveBeenCalledWith(normalizedVocabName, undefined);
        });
    });

    it('does not render edit button when editing', () => {
        const wrapper = mountWithIntl(<TermDetail term={term} vocabulary={vocabulary} loadTerm={onLoad}
                                                  updateTerm={onUpdate} publishNotification={onPublishNotification}
                                                  reloadVocabularyTerms={onLoadTerms} history={history}
                                                  location={location} match={match}
                                                  {...intlFunctions()}/>);
        const editButton = wrapper.find(Button).findWhere(w => w.key() === 'term-detail-edit');
        expect(editButton.exists()).toBeTruthy();
        editButton.simulate('click');
        const editButtonAgain = wrapper.find(Button).findWhere(w => w.key() === 'term-detail-edit');
        expect(editButtonAgain.exists()).toBeFalsy();
    });

    it("publishes term update notification when sub terms change", () => {
        const wrapper = shallow(<TermDetail term={term} vocabulary={vocabulary} loadTerm={onLoad} updateTerm={onUpdate}
                                            reloadVocabularyTerms={onLoadTerms} history={history}
                                            location={location} match={match}
                                            publishNotification={onPublishNotification}
                                            {...intlFunctions()} {...intlDataForShallow()}/>);
        const update = new Term(Object.assign({}, term));
        const newChild = Generator.generateUri();
        update.subTerms = [{iri: newChild}];
        update.plainSubTerms = [newChild];
        (wrapper.instance() as TermDetail).onSave(update);
        return Promise.resolve().then(() => {
            expect(onPublishNotification).toHaveBeenCalledWith({source: {type: NotificationType.TERM_CHILDREN_UPDATED}});
        });
    });
});