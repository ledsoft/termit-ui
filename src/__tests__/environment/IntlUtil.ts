import {createIntl, IntlShape} from "react-intl";
import intlData from "../../i18n/en";
import {HasI18n} from "../../component/hoc/withI18n";

const intlInst = createIntl(intlData);

export function intl(): IntlShape {
    return intlInst;
}

export function i18n(id: string): string {
    return intlData.messages[id];
}

export function formatMessage(id: string, values: {}): string {
    return intlInst.formatMessage({id}, values);
}

/**
 * Provides intl functions/values expected by the Has18n props interface.
 */
export function intlFunctions():HasI18n {
    return {
        i18n,
        formatMessage,
        locale: intlData.locale
    };
}
