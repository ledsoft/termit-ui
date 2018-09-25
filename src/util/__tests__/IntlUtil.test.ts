import {loadInitialLocalizationData, loadLocalizationData, saveLanguagePreference} from "../IntlUtil";
import Constants from "../Constants";

describe('IntlUtil', () => {

    beforeEach(() => {
        localStorage.clear();
    });

    it('loads Czech localization data for Czech language', () => {
        const result = loadLocalizationData(Constants.LANG.CS);
        expect(result.locale).toEqual(Constants.LANG.CS);
    });

    it('loads English localization data for English language', () => {
        const result = loadLocalizationData(Constants.LANG.EN);
        expect(result.locale).toEqual(Constants.LANG.EN);
    });

    it('loads English localization data by default', () => {
        const result = loadLocalizationData("de");
        expect(result.locale).toEqual(Constants.LANG.EN);
    });

    it('loads localization data based on language preference stored in localStorage', () => {
        localStorage.__STORE__[Constants.STORAGE_LANG_KEY] = Constants.LANG.CS;
        const result = loadInitialLocalizationData();
        expect(result.locale).toEqual(Constants.LANG.CS);
    });

    it('stores language preference in local storage', () => {
        saveLanguagePreference(Constants.LANG.CS);
        expect(localStorage.__STORE__[Constants.STORAGE_LANG_KEY]).toEqual(Constants.LANG.CS);
    });
});