import * as React from 'react';
import {Location} from 'history';
import {match as Match} from 'react-router';
import createMemoryHistory from "history/createMemoryHistory";
import {shallow} from "enzyme";
import {TermDetail} from "../TermDetail";
import {intlDataForShallow} from "../../../__tests__/environment/Environment";
import {formatMessage, i18n} from "../../../__tests__/environment/IntlUtil";

describe('TermDetail', () => {

    const normalizedTermName = 'test-term';
    const normalizedVocabName = 'test-vocabulary';

    let location: Location;
    const history = createMemoryHistory();
    let match: Match<any>;

    let onLoad: (termName: string, vocabName: string, namespace?: string) => void;

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
    });

    it('loads term on mount', () => {
        shallow(<TermDetail term={null} vocabulary={null} loadTerm={onLoad} history={history}
                            location={location} match={match}
                            i18n={i18n} formatMessage={formatMessage} {...intlDataForShallow()}/>);
        expect(onLoad).toHaveBeenCalledWith(normalizedTermName, normalizedVocabName, undefined);
    });

    it('provides namespace to term loading when specified in url', () => {
        const namespace = 'http://onto.fel.cvut.cz/ontologies/termit/vocabularies/';
        location.search = '?namespace=' + namespace;
        shallow(<TermDetail term={null} vocabulary={null} loadTerm={onLoad} history={history}
                            location={location} match={match}
                            i18n={i18n} formatMessage={formatMessage} {...intlDataForShallow()}/>);
        expect(onLoad).toHaveBeenCalledWith(normalizedTermName, normalizedVocabName, namespace);
    });
});