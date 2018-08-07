import * as React from 'react';
import I18nStore from '../../../store/I18nStore';
import {mount} from "enzyme";
import LanguageSelector from "../LanguageSelector";
import Constants from "../../../util/Constants";

describe('Language selector', () => {

    it('renders selected language element', () => {
        I18nStore.activeLanguage = Constants.LANG.EN;
        const wrapper = mount(<LanguageSelector/>);
        const element = wrapper.find('.selected');
        expect(element).toBeDefined();
        expect(element.text().toLowerCase()).toEqual(Constants.LANG.EN);
    });

    it('changes active language to Czech when Czech language selector is clicked', () => {
        const wrapper = mount(<LanguageSelector/>);
        const element = wrapper.find('a.lang').at(0);
        element.simulate('click');
        expect(I18nStore.activeLanguage).toEqual(Constants.LANG.CS);
    });

    it('changes active language to English when English language selector is clicked', () => {
        const wrapper = mount(<LanguageSelector/>);
        const element = wrapper.find('a.lang').at(1);
        element.simulate('click');
        expect(I18nStore.activeLanguage).toEqual(Constants.LANG.EN);
    });
});