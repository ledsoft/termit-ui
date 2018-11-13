import * as React from 'react';
import AssetLink from "../AssetLink";
import {EMPTY_VOCABULARY} from "../../../model/Vocabulary";
import {MemoryRouter} from "react-router";
import {mountWithIntl} from "../../../__tests__/environment/Environment";

describe('Asset Link', () => {
    const voc = EMPTY_VOCABULARY;

    it('Render internal link', () => {
        const wrapper = mountWithIntl(<MemoryRouter><AssetLink
            asset={voc}
            assetContextPath={"/vocabulary"}
        /></MemoryRouter>);
        expect(wrapper.find('Link[to="/vocabulary/empty?namespace=http://"]').exists()).toBeTruthy();
    });
    it('Render outgoing link', () => {
        const wrapper = mountWithIntl(<MemoryRouter><AssetLink
            asset={voc}
            assetContextPath={"/vocabulary"}
        /></MemoryRouter>);
        expect(wrapper.find('a[href="http://empty"]').exists()).toBeTruthy();
    });
});

