import * as React from 'react';
import {ReactElement} from 'react';
import {mount} from "enzyme";
import intlData from '../../i18n/en';
import {IntlProvider} from "react-intl";
import {Provider} from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

const mockStore = configureMockStore([thunk]);

/**
 * Uses enzyme's mount function, but wraps the specified component in Provider and IntlProvider, so that Redux and
 * React Intl context are set up.
 * @param node The element to render
 */
export function mountWithIntl(node: ReactElement<any>) {
    return mount(<Provider store={mockStore({})}><IntlProvider {...intlData}>{node}</IntlProvider></Provider>);
}

export function intlDataForShallow(): {} {
    const intlProvider = new IntlProvider(intlData);
    return intlProvider.getChildContext();
}