import * as React from 'react';
import {mount} from "enzyme";
import {LanguageSelector} from "../LanguageSelector";
import Constants from "../../../util/Constants";

describe('Language selector', () => {

    let switchLanguage: (lang: string) => void;

    beforeEach(() => {
        switchLanguage = jest.fn();
    });

    it('renders selected language element', () => {
        const selectedLanguage = Constants.LANG.EN;
        const wrapper = mount(<LanguageSelector language={selectedLanguage} switchLanguage={switchLanguage}/>);
        const element = wrapper.find('.active');
        expect(element).toBeDefined();
        expect(element.text().toLowerCase()).toEqual(Constants.LANG.EN);
    });

    it('changes active language to Czech when Czech language selector is clicked', () => {
        const wrapper = mount(<LanguageSelector language={Constants.LANG.EN} switchLanguage={switchLanguage}/>);
        const element = wrapper.find('.nav-link').at(0);
        element.simulate('click');
        expect(switchLanguage).toHaveBeenCalledWith(Constants.LANG.CS);
    });

    it('changes active language to English when English language selector is clicked', () => {
        const wrapper = mount(<LanguageSelector language={Constants.LANG.CS} switchLanguage={switchLanguage}/>);
        const element = wrapper.find('.nav-link').at(1);
        element.simulate('click');
        expect(switchLanguage).toHaveBeenCalledWith(Constants.LANG.EN);
    });

    it('does not emit action when already active language selector is clicked - Czech', () => {
        const wrapper = mount(<LanguageSelector language={Constants.LANG.CS} switchLanguage={switchLanguage}/>);
        const element = wrapper.find('.nav-link').at(0);
        element.simulate('click');
        expect(switchLanguage).not.toHaveBeenCalled();
    });

    it('does not emit action when already active language selector is clicked - English', () => {
        const wrapper = mount(<LanguageSelector language={Constants.LANG.EN} switchLanguage={switchLanguage}/>);
        const element = wrapper.find('.nav-link').at(1);
        element.simulate('click');
        expect(switchLanguage).not.toHaveBeenCalled();
    });
});
