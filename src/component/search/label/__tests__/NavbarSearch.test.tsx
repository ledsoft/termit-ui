import * as React from 'react';
import {NavbarSearch} from '../NavbarSearch';
import {mountWithIntl} from "../../../../__tests__/environment/Environment";
import {intlFunctions} from "../../../../__tests__/environment/IntlUtil";
import SearchResultsOverlay from "../SearchResultsOverlay";
import SearchResult from "../../../../model/SearchResult";
import Vocabulary from "../../../../util/VocabularyUtils";
import Routing from '../../../../util/Routing';
import Routes from "../../../../util/Routes";

jest.mock('../../../../util/Routing');

describe('NavbarSearch', () => {

    let search: (str: string) => Promise<object>;

    beforeEach(() => {
        search = jest.fn().mockImplementation(() => Promise.resolve([]));
    });

    it('does not render results component for initial state', () => {
        const wrapper = mountWithIntl(<NavbarSearch search={search} {...intlFunctions()}/>);
        const resultsOverlay = wrapper.find(SearchResultsOverlay);
        expect(resultsOverlay.exists()).toBeFalsy();
    });

    it('invokes search on change', () => {
        const div = document.createElement('div');
        document.body.appendChild(div);
        const wrapper = mountWithIntl(<NavbarSearch search={search} {...intlFunctions()}/>, {attachTo: div});
        const searchStr = 'test';
        const input = wrapper.find('input');
        (input.getDOMNode() as HTMLInputElement).value = searchStr;
        input.simulate('change', input);
        return Promise.resolve().then(() => {
            expect(search).toHaveBeenCalledWith(searchStr);
        });
    });

    it('does not invoke search on change if input is empty', () => {
        const wrapper = mountWithIntl(<NavbarSearch search={search} {...intlFunctions()}/>);
        const input = wrapper.find('input');
        (input.getDOMNode() as HTMLInputElement).value = '';
        input.simulate('change', input);
        expect(search).not.toHaveBeenCalled();
    });

    it('transitions to vocabulary detail on open result', () => {
        const namespace = 'http://onto.fel.cvut.cz/ontologies/termit/vocabularies/';
        const normalizedName = 'result-one';
        const result = new SearchResult({
            label: 'Result One',
            iri: namespace + normalizedName,
            types: [Vocabulary.VOCABULARY]
        });
        jest.fn().mockImplementation(() => Promise.resolve([result]));
        const div = document.createElement('div');
        document.body.appendChild(div);
        const wrapper = mountWithIntl(<NavbarSearch search={search} {...intlFunctions()}/>, {attachTo: div});
        (wrapper.find(NavbarSearch).instance() as NavbarSearch).search('test');
        return Promise.resolve().then(() => {
            (wrapper.find(NavbarSearch).instance() as NavbarSearch).openResult(result);
            expect(Routing.transitionTo).toHaveBeenCalledWith(Routes.vocabularySummary, {
                params: new Map([['name', normalizedName]]),
                query: new Map([['namespace', namespace]])
            });
        });
    });

    it('transitions to term detail on open result', () => {
        const namespace = 'http://onto.fel.cvut.cz/ontologies/termit/vocabularies/';
        const normalizedName = 'result-one';
        const normalizedVocabName = 'test-vocabulary';
        const result = new SearchResult({
            label: 'Result One',
            iri: namespace + normalizedName,
            types: [Vocabulary.TERM],
            vocabulary: {iri: namespace + normalizedVocabName}
        });
        jest.fn().mockImplementation(() => Promise.resolve([result]));
        const div = document.createElement('div');
        document.body.appendChild(div);
        const wrapper = mountWithIntl(<NavbarSearch search={search} {...intlFunctions()}/>, {attachTo: div});
        (wrapper.find(NavbarSearch).instance() as NavbarSearch).search('test');
        return Promise.resolve().then(() => {
            (wrapper.find(NavbarSearch).instance() as NavbarSearch).openResult(result);
            expect(Routing.transitionTo).toHaveBeenCalledWith(Routes.vocabularyTermDetail, {
                params: new Map([['name', normalizedVocabName], ['termName', normalizedName]]),
                query: new Map([['namespace', namespace]])
            });
        });
    });
});