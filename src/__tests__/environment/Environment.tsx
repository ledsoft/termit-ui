import * as React from 'react';
import {ReactElement} from 'react';
import {mount, MountRendererProps} from "enzyme";
import intlData from '../../i18n/en';
import {IntlProvider} from "react-intl";
import {Provider} from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import TermItState from "../../model/TermItState";

const mockStore = configureMockStore([thunk]);

/**
 * Uses enzyme's mount function, but wraps the specified component in Provider and IntlProvider, so that Redux and
 * React Intl context are set up.
 * @param node The element to render
 * @param options Optional rendering options for Enzyme
 */
export function mountWithIntl(node: ReactElement<any>, options?: MountRendererProps) {
    return mount(<Provider store={mockStore(new TermItState())}>
        <IntlProvider {...intlData}>{node}</IntlProvider>
    </Provider>, options);
}

export function intlDataForShallow(): {} {
    const intlProvider = new IntlProvider(intlData);
    return intlProvider.getChildContext();
}