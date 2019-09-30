import Constants from "./Constants";
import IntlData from "../model/IntlData";

export function loadInitialLocalizationData(): IntlData {
    const prefLang = localStorage.getItem(Constants.STORAGE_LANG_KEY);
    const lang = prefLang ? prefLang : navigator.language;
    if (lang && lang === "cs" || lang === "cs-CZ" || lang === "sk" || lang === "sk-SK") {
        setHtmlLanguage(Constants.LANG.CS.locale);
        return loadLocalizationData(Constants.LANG.CS.locale);
    } else {
        return loadLocalizationData(Constants.LANG.EN.locale);
    }
}

export function loadLocalizationData(language: string): IntlData {
    switch (language) {
        case Constants.LANG.CS.locale:
            return require("../i18n/cs").default;
        default:
            return require("../i18n/en").default;
    }
}

export function saveLanguagePreference(language: string): void {
    localStorage.setItem(Constants.STORAGE_LANG_KEY, language);
}

/**
 * Sets the "lang" attribute on the root HTML element.
 * @param language The language to set
 */
export function setHtmlLanguage(language: string): void {
    document.documentElement.lang = language;
}