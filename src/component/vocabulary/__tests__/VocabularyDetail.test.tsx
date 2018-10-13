import * as React from 'react';
import {VocabularyDetail} from '../VocabularyDetail';
import {formatMessage, i18n} from "../../../__tests__/environment/IntlUtil";
import {intlDataForShallow} from "../../../__tests__/environment/Environment";
import {shallow} from "enzyme";
import {EMPTY_VOCABULARY} from "../../../model/Vocabulary";
import createMemoryHistory from "history/createMemoryHistory";
import {IRI} from "../../../util/VocabularyUtils";


describe('VocabularyDetail', () => {

    const location = {
        pathname: '/vocabulary/metropolitan-plan/detail',
        search: '',
        hash: '',
        state: {}
    };
    const history = createMemoryHistory();
    const match = {
        params: {
            name: 'metropolitan-plan'
        },
        path: '/vocabulary/metropolitan-plan/detail',
        isExact: true,
        url: 'http://localhost:3000/vocabulary/metropolitan-plan/detail'
    };

    let loadVocabulary: (vocabulary: IRI) => void;
    let loadTypes: (lang: string) => void;

    beforeEach(() => {
        loadVocabulary = jest.fn();
        loadTypes = jest.fn();
    });

    it('loads vocabulary on mount', () => {
        shallow(<VocabularyDetail vocabulary={EMPTY_VOCABULARY} loadVocabulary={loadVocabulary}
                                  loadTypes={loadTypes} i18n={i18n}
                                  lang={"en"}
                                  formatMessage={formatMessage}
                                  history={history} location={location} match={match} {...intlDataForShallow()}/>);
        expect(loadVocabulary).toHaveBeenCalledWith({fragment:'metropolitan-plan'});
    });
});