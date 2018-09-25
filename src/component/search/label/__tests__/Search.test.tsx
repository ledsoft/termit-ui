import * as React from 'react';
import {Search} from '../Search';
import {mountWithIntl} from "../../../../__tests__/environment/Environment";
import {formatMessage, i18n} from "../../../../__tests__/environment/IntlUtil";
import SearchResultsOverlay from "../SearchResultsOverlay";
import SearchResult from "../../../../model/SearchResult";
import Generator from "../../../../__tests__/environment/Generator";

describe('Search', () => {

    let search: (str: string) => void;
    let clearSearch: () => void;

    beforeEach(() => {
        search = jest.fn();
        clearSearch = jest.fn();
    });

    it('does not render results component for initial state', () => {
        const wrapper = mountWithIntl(<Search search={search} clearSearch={clearSearch} searchResults={null} i18n={i18n}
                                              formatMessage={formatMessage}/>);
        const resultsOverlay = wrapper.find(SearchResultsOverlay);
        expect(resultsOverlay.exists()).toBeFalsy();
    });

    it('invokes search on change', () => {
        const wrapper = mountWithIntl(<Search search={search} clearSearch={clearSearch} searchResults={null} i18n={i18n}
                                              formatMessage={formatMessage}/>);
        const searchStr = 'test';
        const input = wrapper.find('input');
        (input.getDOMNode() as HTMLInputElement).value = searchStr;
        input.simulate('change', input);
        expect(search).toHaveBeenCalledWith(searchStr);
    });

    it('does not invoke search on change if input is empty', () => {
        const wrapper = mountWithIntl(<Search search={search} clearSearch={clearSearch} searchResults={null} i18n={i18n}
                                              formatMessage={formatMessage}/>);
        const input = wrapper.find('input');
        (input.getDOMNode() as HTMLInputElement).value = '';
        input.simulate('change', input);
        expect(search).not.toHaveBeenCalled();
    });

    it.skip('shows only first x search results, others can be viewed on dedicated search page', () => {
        // Skipped for now, there are issues with Popover rendering content asynchronously, which breaks the content
        // search
        const results: SearchResult[] = [];
        for (let i = 0; i < 10 + 5; i++) {
            results.push(new SearchResult({
                iri: Generator.generateUri(),
                label: 'Result ' + i,
                types: ['http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/term']
            }));
        }
        const div = document.createElement('div');
        document.body.appendChild(div);
        const wrapper = mountWithIntl(<Search search={search} clearSearch={clearSearch} searchResults={results}
                                              i18n={i18n}
                                              formatMessage={formatMessage}/>, {attachTo: div});
        return Promise.resolve().then(() => {
            const items = wrapper.find('.search-result-link');
            expect(items.length).toEqual(10);
        });
    });
});