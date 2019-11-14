import * as React from "react";
import {ReactElement} from "react";
import {mount, MountRendererProps} from "enzyme";
import intlData from "../../i18n/en";
import {IntlProvider} from "react-intl";
import {Provider} from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import TermItState from "../../model/TermItState";
// @ts-ignore
import TimeAgo from "javascript-time-ago";

const mockStore = configureMockStore([thunk]);

const scheduler = typeof setImmediate === "function" ? setImmediate : setTimeout;

/**
 * Uses enzyme"s mount function, but wraps the specified component in Provider and IntlProvider, so that Redux and
 * React Intl context are set up.
 * @param node The element to render
 * @param options Optional rendering options for Enzyme
 */
export function mountWithIntl(node: ReactElement<any>, options?: MountRendererProps) {
    // Load locales for the TimeAgo library
    TimeAgo.addLocale(require("javascript-time-ago/locale/en"));
    return mount(<Provider store={mockStore(new TermItState())}>
        <IntlProvider {...intlData}>{node}</IntlProvider>
    </Provider>, options);
}

/**
 * Utility function to flush all pending promises in an async test.
 */
export function flushPromises() {
    return new Promise((resolve) => {
        scheduler(resolve, 0);
    });
}
