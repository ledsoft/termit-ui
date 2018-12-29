import * as React from "react";
import {mountWithIntl} from "../../../../__tests__/environment/Environment";
import {SearchResults} from "../SearchResults";
import {intlFunctions} from "../../../../__tests__/environment/IntlUtil";
import {Label} from "reactstrap";
import en from "../../../../i18n/en";

describe("SearchResults", () => {

    it("render no results info when no results are found", () => {
        const wrapper = mountWithIntl(<SearchResults results={[]} {...intlFunctions()}/>);
        const label = wrapper.find(Label);
        expect(label.exists()).toBeTruthy();
        expect(label.text()).toContain(en.messages["main.search.no-results"]);
    });
});