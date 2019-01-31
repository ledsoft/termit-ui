import {saveLanguagePreference} from "../../util/IntlUtil";
import {switchLanguage} from "../SyncActions";
import Constants from "../../util/Constants";

jest.mock("../../util/IntlUtil");

describe("Synchronous actions", () => {

    describe("switch language", () => {

        it("saves language preference into storage", () => {
            switchLanguage(Constants.LANG.CS.locale);
            expect(saveLanguagePreference).toHaveBeenCalledWith(Constants.LANG.CS.locale);
        });
    });
});