import * as React from "react";
import Asset from "../../../../model/Asset";
import {shallow} from "enzyme";
import {LastEditedAssets} from "../LastEditedAssets";
import {intlFunctions} from "../../../../__tests__/environment/IntlUtil";
import {intlDataForShallow, mountWithIntl} from "../../../../__tests__/environment/Environment";
import en from "../../../../i18n/en";
import Term from "../../../../model/Term";
import Generator from "../../../../__tests__/environment/Generator";
import Vocabulary from "../../../../model/Vocabulary";
import {Link, MemoryRouter} from "react-router-dom";

describe("LastEditedAssets", () => {
    let onLoad: () => Promise<Asset[]>;

    beforeEach(() => {
        onLoad = jest.fn().mockImplementation(() => Promise.resolve([]));
    });

    it("loads last edited assets on mount", () => {
        shallow(<LastEditedAssets loadAssets={onLoad} {...intlFunctions()} {...intlDataForShallow()}/>);
        expect(onLoad).toHaveBeenCalled();
    });

    it("renders info message when no assets were found", () => {
        const wrapper = mountWithIntl(<MemoryRouter>
            <LastEditedAssets loadAssets={onLoad} {...intlFunctions()}/>
        </MemoryRouter>);
        const info = wrapper.find(".italics");
        expect(info.exists()).toBeTruthy();
        expect(info.text()).toEqual(en.messages["dashboard.widget.lastEdited.empty"]);
    });

    it("renders downloaded assets", () => {
        const assets = [new Term({
            iri: Generator.generateUri(),
            label: "Term"
        }), new Vocabulary({iri: Generator.generateUri(), label: "Vocabulary"})];
        onLoad = jest.fn().mockImplementation(() => Promise.resolve(assets));
        const wrapper = mountWithIntl(<MemoryRouter>
            <LastEditedAssets loadAssets={onLoad} {...intlFunctions()}/>
        </MemoryRouter>);
        return Promise.resolve().then(() => {
            wrapper.update();
            const links = wrapper.find(Link);
            expect(links.length).toEqual(2);
            expect(links.at(0).text()).toEqual(assets[0].label);
            expect(links.at(1).text()).toEqual(assets[1].label);
        });
    });
});