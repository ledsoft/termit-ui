import * as React from "react";
import Generator from "../../../__tests__/environment/Generator";
import Asset from "../../../model/Asset";
import ChangeRecord from "../../../model/changetracking/ChangeRecord";
import {AssetHistory} from "../AssetHistory";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import {flushPromises, mountWithIntl} from "../../../__tests__/environment/Environment";
import {act} from "react-dom/test-utils";

describe("AssetHistory", () => {

    let loadHistory: (asset: Asset) => Promise<ChangeRecord[]>;

    beforeEach(() => {
        loadHistory = jest.fn().mockResolvedValue([]);
    });

    it("loads asset history on mount", async () => {
        const asset = Generator.generateTerm();
        mountWithIntl(<AssetHistory asset={asset} loadHistory={loadHistory} {...intlFunctions()}/>);
        await act(async () => {
            await flushPromises();
        });
        expect(loadHistory).toHaveBeenCalledWith(asset);
    });
});
