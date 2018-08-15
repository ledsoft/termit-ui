import * as React from 'react';
import Routing from '../../../util/Routing';
import {mountWithIntl} from '../../../__tests__/environment/Environment';
import {Dashboard} from '../Dashboard';
import {formatMessage, i18n} from '../../../__tests__/environment/IntlUtil';
import Routes from '../../../util/Routes';
import DashboardTile from '../DashboardTile';
import DashboardQuickAccessTile from '../DashboardQuickAccessTile';

jest.mock('../../../util/Routing');

describe('Dashboard', () => {

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('navigates to vocabulary management when \'Vocabulary Management\' tile is clicked', () => {
        const wrapper = mountWithIntl(<Dashboard i18n={i18n} formatMessage={formatMessage}/>);
        const tiles = wrapper.find(DashboardTile);
        tiles.first().simulate('click');
        expect(Routing.transitionTo).toHaveBeenCalledWith(Routes.vocabularies);
    });

    it('navigates to vocabulary creation screen when \'Create Vocabulary\' quick action is clicked', () => {
        const wrapper = mountWithIntl(<Dashboard i18n={i18n} formatMessage={formatMessage}/>);
        const tiles = wrapper.find(DashboardQuickAccessTile);
        tiles.first().simulate('click');
        expect(Routing.transitionTo).toHaveBeenCalledWith(Routes.createVocabulary);
    });
});