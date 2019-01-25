import * as React from "react";
import {mount, shallow} from "enzyme";
import {LanguageSelector} from "../LanguageSelector";
import Constants from "../../../util/Constants";

describe("Language selector", () => {

    let switchLanguage: (lang: string) => void;

    beforeEach(() => {
        switchLanguage = jest.fn();
    });

    it("renders selected language", () => {
        const selectedLanguage = Constants.LANG.EN;
        const wrapper = mount(<LanguageSelector language={selectedLanguage.locale} switchLanguage={switchLanguage}/>);
        const element = wrapper.find("a[name=\"language-selector\"]");
        expect(element).toBeDefined();
        expect(element.text()).toEqual(Constants.LANG.EN.label);
    });

    it("changes active language to specified value when language is selected", () => {
        const wrapper = shallow(<LanguageSelector language={Constants.LANG.EN.locale}
                                                  switchLanguage={switchLanguage}/>);
        (wrapper.instance() as LanguageSelector).onSelect(Constants.LANG.CS.locale);
        expect(switchLanguage).toHaveBeenCalledWith(Constants.LANG.CS.locale);
    });

    it("does not emit action when already active language selector is clicked - Czech", () => {
        const wrapper = shallow(<LanguageSelector language={Constants.LANG.CS.locale}
                                                  switchLanguage={switchLanguage}/>);
        (wrapper.instance() as LanguageSelector).onSelect(Constants.LANG.CS.locale);
        expect(switchLanguage).not.toHaveBeenCalled();
    });
});
