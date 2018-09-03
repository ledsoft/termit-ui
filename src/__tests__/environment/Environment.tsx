import * as React from 'react';
import {ReactElement} from 'react';
import {mount} from "enzyme";
import intlData from '../../i18n/en';
import {IntlProvider} from "react-intl";

/**
 * Uses enzyme's mount function, but wraps the specified component in an IntlProvider, so that React Intl context is
 * set up.
 * @param node The element to render
 */
export function mountWithIntl(node: ReactElement<any>) {
    return mount(<IntlProvider {...intlData}>{node}</IntlProvider>);
}

export function intlDataForShallow(): {} {
    const intlProvider = new IntlProvider(intlData);
    return intlProvider.getChildContext();
}