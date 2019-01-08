import * as React from "react";
import FTSMatch from "../FTSMatch";
import {mountWithIntl} from "../../../../__tests__/environment/Environment";
import {intlFunctions} from "../../../../__tests__/environment/IntlUtil";
import en from "../../../../i18n/en";

describe("FTSMatch", () => {
    it("renders match as element with highlighting class and match content", () => {
        const snippet = ["<em>Match</em> text"];
        const wrapper = mountWithIntl(<FTSMatch matches={snippet} fields={["label"]} {...intlFunctions()}/>);
        const elem = wrapper.find(".search-result-snippet-match");
        expect(elem.length).toEqual(1);
        expect(elem.text()).toEqual("Match");
    });

    it("renders multiple matches as elements with highlighting class", () => {
        const snippet = ["<em>Match</em> text and another <em>match</em> here"];
        const wrapper = mountWithIntl(<FTSMatch matches={snippet} fields={["label"]} {...intlFunctions()}/>);
        const elem = wrapper.find(".search-result-snippet-match");
        expect(elem.length).toEqual(2);
    });

    it("renders match field using i18n so that it supports localization", () => {
        const snippet = ["<em>Match</em> text"];
        const field = ["label"];
        const wrapper = mountWithIntl(<FTSMatch matches={snippet} fields={field} {...intlFunctions()}/>);
        const fieldElem = wrapper.find("span.search-result-field-badge");
        expect(fieldElem.text()).toEqual(en.messages["search.results.field.label"]);
    });
});