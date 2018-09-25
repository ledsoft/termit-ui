import * as React from 'react';
import {MainView} from '../MainView';
import User, {EMPTY_USER} from "../../model/User";
import {formatMessage, i18n} from "../../__tests__/environment/IntlUtil";
import {shallow} from "enzyme";
import createMemoryHistory from "history/createMemoryHistory";

describe('MainView', () => {

    const location = {
        pathname: '/',
        search: '',
        hash: '',
        state: {}
    };
    const history = createMemoryHistory();
    const match = {
        params: {},
        path: '/',
        isExact: true,
        url: 'http://localhost:3000/'
    };

    let loadUser: () => void;
    let logout: () => void;

    beforeEach(() => {
        loadUser = jest.fn();
        logout = jest.fn();
    });

    it('loads user on mount', () => {
        shallow(<MainView user={EMPTY_USER} loadUser={loadUser} logout={logout} i18n={i18n}
                          formatMessage={formatMessage} history={history} location={location} match={match}/>);
        expect(loadUser).toHaveBeenCalled();
    });

    it('does not load user when it is already present in store', () => {
        const user = new User({
            firstName: 'Catherine',
            lastName: 'Halsey',
            username: 'halsey@unsc.org',
            iri: 'http://onto.fel.cvut.cz/ontologies/termit/catherine-halsey'
        });
        shallow(<MainView user={user} loadUser={loadUser} logout={logout} i18n={i18n}
                          formatMessage={formatMessage} history={history} location={location} match={match}/>);
        expect(loadUser).not.toHaveBeenCalled();
    });
});