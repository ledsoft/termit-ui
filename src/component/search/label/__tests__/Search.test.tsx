import * as React from 'react';
import {Search} from '../Search';
import {mountWithIntl} from "../../../../__tests__/environment/Environment";
import {formatMessage, i18n} from "../../../../__tests__/environment/IntlUtil";
import SearchResultsOverlay from "../SearchResultsOverlay";

describe('Search', () => {

    let search: (str: string) => void;

    beforeEach(() => {
        search = jest.fn();
    });

    it('does not render results component for initial state', () => {
        const wrapper = mountWithIntl(<Search search={search} searchResults={null} i18n={i18n}
                                              formatMessage={formatMessage}/>);
        const resultsOverlay = wrapper.find(SearchResultsOverlay);
        expect(resultsOverlay.exists()).toBeFalsy();
    });

    it('invokes search on change', () => {
        const wrapper = mountWithIntl(<Search search={search} searchResults={null} i18n={i18n}
                                              formatMessage={formatMessage}/>);
        const searchStr = 'test';
        const input = wrapper.find('input');
        (input.getDOMNode() as HTMLInputElement).value = searchStr;
        input.simulate('change', input);
        expect(search).toHaveBeenCalledWith(searchStr);
    });

    it('does not invoke search on change if input is empty', () => {
        const wrapper = mountWithIntl(<Search search={search} searchResults={null} i18n={i18n}
                                              formatMessage={formatMessage}/>);
        const input = wrapper.find('input');
        (input.getDOMNode() as HTMLInputElement).value = '';
        input.simulate('change', input);
        expect(search).not.toHaveBeenCalled();
    });
});