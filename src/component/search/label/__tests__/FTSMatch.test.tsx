import * as React from "react";
import {mount} from "enzyme";
import FTSMatch from "../FTSMatch";

describe("FTSMatch", () => {
    it("renders match as element with highlighting class and match content", () => {
        const snippet = ["<em>Match</em> text"];
        const wrapper = mount(<FTSMatch matches={snippet} fields={["label"]}/>);
        const elem = wrapper.find(".search-result-snippet-match");
        expect(elem.length).toEqual(1);
        expect(elem.text()).toEqual("Match");
    });

    it("renders multiple matches as elements with highlighting class", () => {
        const snippet = ["<em>Match</em> text and another <em>match</em> here"];
        const wrapper = mount(<FTSMatch matches={snippet} fields={["label"]}/>);
        const elem = wrapper.find(".search-result-snippet-match");
        expect(elem.length).toEqual(2);
    });
});