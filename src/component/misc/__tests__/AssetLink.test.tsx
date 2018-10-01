import * as React from 'react';
import {mount} from "enzyme";
import AssetLink from "../AssetLink";
import {EMPTY_VOCABULARY} from "../../../model/Vocabulary";
import {MemoryRouter} from "react-router";

describe('Asset Link', () => {
    const voc = EMPTY_VOCABULARY;

    it('Render internal link', () => {
        const wrapper = mount(<MemoryRouter><AssetLink
            asset={voc}
            assetContextPath={"/vocabulary"}
        /></MemoryRouter>);
        expect(wrapper.find('Link[to="/vocabulary/empty?namespace=http://"]').exists()).toBeTruthy();
    });
    it('Render outgoing link', () => {
        const wrapper = mount(<MemoryRouter><AssetLink
            asset={voc}
            assetContextPath={"/vocabulary"}
        /></MemoryRouter>);
        expect(wrapper.find('a[href="http://empty"]').exists()).toBeTruthy();
    });
});

