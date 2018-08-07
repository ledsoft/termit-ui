import * as Cookies from "js-cookie";
import Constants from "./Constants";
import IntlData from "../model/IntlData";

export function loadInitialLocalizationData(): IntlData {
    const prefLang = Cookies.get(Constants.LANGUAGE_COOKIE);
    const lang = prefLang ? prefLang : navigator.language;
    if (lang && lang === 'cs' || lang === 'cs-CZ' || lang === 'sk' || lang === 'sk-SK') {
        return loadLocalizationData(Constants.LANG.CS);
    } else {
        return loadLocalizationData(Constants.LANG.EN);
    }
}

export function loadLocalizationData(language: string): IntlData {
    switch (language) {
        case Constants.LANG.CS:
            return require('../i18n/cs').default;
        default:
            return require('../i18n/en').default;
    }
}