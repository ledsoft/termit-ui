import * as Cookies from 'js-cookie';
import Constants from '../util/Constants';

class I18nStore {
    get intl(): {} {
        return this.mIntl;
    }

    set intl(value: {}) {
        this.mIntl = value;
    }

    get activeLanguage(): string {
        return this.lang;
    }

    set activeLanguage(value: string) {
        Cookies.set(Constants.LANGUAGE_COOKIE, value);
        this.lang = value;
    }

    set messages(value: {}) {
        this.mMessages = value;
    }

    private lang: string;
    private mMessages: {};
    private mIntl: {};

    public i18n(messageId: string): string {
        return this.mMessages[messageId];
    }
}

const INSTANCE = new I18nStore();

export default INSTANCE;