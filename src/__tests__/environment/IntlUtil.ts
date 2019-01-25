import {IntlProvider} from 'react-intl';
import intlData from '../../i18n/en';
import InjectedIntl = ReactIntl.InjectedIntl;
import {HasI18n} from "../../component/hoc/withI18n";

const intlProvider = new IntlProvider(intlData, {});

export function intl(): InjectedIntl {
    return intlProvider.getChildContext().intl;
}

export function i18n(id: string): string {
    return intlData.messages[id];
}

export function formatMessage(id: string, values: {}): string {
    return intlProvider.getChildContext().intl.formatMessage({id}, values);
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