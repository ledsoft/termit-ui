import * as React from 'react';
import {mountWithIntl} from "../../../__tests__/environment/Environment";
import {formatMessage, i18n} from "../../../__tests__/environment/IntlUtil";
import {Tabs} from "../Tabs";
import {ReactElement} from "react";

describe('Tabs Test', () => {
    let change : () => void;
    let tabs : ReactElement<any>;

    beforeEach(() => {
        change = jest.fn()
        tabs = <Tabs
            activeTabLabelKey={"k1"}
            tabs={ {"k1" : ()=><div>K1</div>, "k2" : ()=><div>K2</div> }}
            changeTab={change}
            i18n={i18n}
            formatMessage={formatMessage}
        />
    });

    it('Tab container contains correct number of tabs', () => {
        const wrapper = mountWithIntl(tabs);
        expect(wrapper.find('NavLink').length).toEqual(2);
    });

    it('Change action called upon non-active tab clicked', () => {
        const wrapper = mountWithIntl(tabs);
        wrapper.find('NavLink').at(1).simulate('click');
        expect(change).toHaveBeenCalled();
    });

    it('Change action not called upon active tab clicked', () => {
        const wrapper = mountWithIntl(tabs);
        wrapper.find('NavLink').at(0).simulate('click');
        expect(change).not.toHaveBeenCalled();
    });
});