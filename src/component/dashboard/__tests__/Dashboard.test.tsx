import * as React from "react";
import {Dashboard} from "../Dashboard";
import {MemoryRouter} from "react-router-dom";
import {formatMessage, i18n} from "../../../__tests__/environment/IntlUtil";
import {mountWithIntl} from "../../../__tests__/environment/Environment";

jest.mock("../../../util/Routing");

describe("Dashboard", () => {

    afterEach(() => {
        jest.resetAllMocks();
    });

    it("loads a dashboard", () => {
        mountWithIntl(<MemoryRouter><Dashboard i18n={i18n} formatMessage={formatMessage}  locale="cs"/></MemoryRouter>);
    });

});
