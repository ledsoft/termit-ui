import {loadLocalizationData} from "../IntlUtil";
import Constants from "../Constants";

describe('IntlUtil', () => {

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
});