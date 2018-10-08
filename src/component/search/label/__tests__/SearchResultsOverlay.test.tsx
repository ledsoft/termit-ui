import SearchResult from "../../../../model/SearchResult";
import Generator from "../../../../__tests__/environment/Generator";
import Vocabulary from "../../../../util/VocabularyUtils";
import {mountWithIntl} from "../../../../__tests__/environment/Environment";
import {formatMessage, i18n} from "../../../../__tests__/environment/IntlUtil";
import * as React from "react";
import {MAX_RENDERED_RESULTS, SearchResultsOverlay} from "../SearchResultsOverlay";
import {Simulate} from 'react-dom/test-utils';

describe('SearchResultsOverlay', () => {

    let onClose: () => void;
    let onClick: (r: SearchResult) => void;
    let onOpenSearch: () => void;

    let element: HTMLDivElement;

    beforeEach(() => {
        onClose = jest.fn();
        onOpenSearch = jest.fn();
        onClick = jest.fn();
        element = document.createElement('div');
        element.id = 'root';
        document.body.appendChild(element);
    });

    it('shows only first x search results, others can be viewed on dedicated search page', () => {
        const results: SearchResult[] = [];
        for (let i = 0; i < MAX_RENDERED_RESULTS + 5; i++) {
            results.push(new SearchResult({
                iri: Generator.generateUri(),
                label: 'Result ' + i,
                types: [Vocabulary.TERM]
            }));
        }
        mountWithIntl(<SearchResultsOverlay targetId='div' show={true} searchResults={results}
                                            onClose={onClose} onClick={onClick}
                                            onOpenSearch={onOpenSearch} i18n={i18n}
                                            formatMessage={formatMessage}/>, {attachTo: element});
        const items = document.getElementsByClassName('search-result-link');
        expect(items.length).toEqual(MAX_RENDERED_RESULTS);
    });

    it('renders info message about no results when empty results are provided', () => {
        mountWithIntl(<SearchResultsOverlay targetId='div' show={true} searchResults={[]}
                                            onClose={onClose} onClick={onClick}
                                            onOpenSearch={onOpenSearch} i18n={i18n}
                                            formatMessage={formatMessage}/>, {attachTo: element});
        const items = document.getElementsByClassName('search-result-link');
        expect(items.length).toEqual(0);
        expect(document.getElementsByClassName('search-result-no-results').length).toEqual(1);
    });

    it('renders count info when more results than displayable count are provided', () => {
        const results: SearchResult[] = [];
        for (let i = 0; i < MAX_RENDERED_RESULTS + 5; i++) {
            results.push(new SearchResult({
                iri: Generator.generateUri(),
                label: 'Result ' + i,
                types: [Vocabulary.TERM]
            }));
        }
        mountWithIntl(<SearchResultsOverlay targetId='div' show={true} searchResults={results}
                                            onClose={onClose} onClick={onClick}
                                            onOpenSearch={onOpenSearch} i18n={i18n}
                                            formatMessage={formatMessage}/>, {attachTo: element});
        expect(document.getElementsByClassName('search-result-link').length).toEqual(MAX_RENDERED_RESULTS);
        expect(document.getElementsByClassName('search-result-info').length).toEqual(1);
    });

    it('invokes onClick with correct result when result link is clicked', () => {
        const results: SearchResult[] = [];
        for (let i = 0; i < MAX_RENDERED_RESULTS; i++) {
            results.push(new SearchResult({
                iri: Generator.generateUri(),
                label: 'Result ' + i,
                types: [Vocabulary.TERM]
            }));
        }
        mountWithIntl(<SearchResultsOverlay targetId='div' show={true} searchResults={results}
                                            onClose={onClose} onClick={onClick}
                                            onOpenSearch={onOpenSearch} i18n={i18n}
                                            formatMessage={formatMessage}/>, {attachTo: element});
        const index = Generator.randomInt(0, MAX_RENDERED_RESULTS);
        const item = document.getElementsByClassName('search-result-link')[index];
        Simulate.click(item);
        expect(onClick).toHaveBeenCalled();
        expect((onClick as jest.Mock).mock.calls[0][0]).toEqual(results[index]);
    });

    it('invokes search open when no results info link is clicked', () => {
        mountWithIntl(<SearchResultsOverlay targetId='div' show={true} searchResults={[]}
                                            onClose={onClose} onClick={onClick}
                                            onOpenSearch={onOpenSearch} i18n={i18n}
                                            formatMessage={formatMessage}/>, {attachTo: element});
        const noResultsInfo = document.getElementsByClassName('search-result-no-results')[0];
        Simulate.click(noResultsInfo);
        expect(onOpenSearch).toHaveBeenCalled();
    });

    it('invokes search open when count info link is clicked', () => {
        const results: SearchResult[] = [];
        for (let i = 0; i < MAX_RENDERED_RESULTS + 5; i++) {
            results.push(new SearchResult({
                iri: Generator.generateUri(),
                label: 'Result ' + i,
                types: [Vocabulary.TERM]
            }));
        }
        mountWithIntl(<SearchResultsOverlay targetId='div' show={true} searchResults={results}
                                            onClose={onClose} onClick={onClick}
                                            onOpenSearch={onOpenSearch} i18n={i18n}
                                            formatMessage={formatMessage}/>, {attachTo: element});
        const infoLink = document.getElementsByClassName('search-result-info')[0];
        Simulate.click(infoLink);
        expect(onOpenSearch).toHaveBeenCalled();
    });
});