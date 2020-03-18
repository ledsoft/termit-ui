import configureMockStore, {MockStoreEnhanced} from "redux-mock-store";
import TermItState from "../../model/TermItState";
import thunk from "redux-thunk";
import VocabularyUtils from "../../util/VocabularyUtils";
import Ajax from "../../util/Ajax";
import {ThunkDispatch} from "../../util/Types";
import {loadTermHistory} from "../AsyncTermActions";
import Constants from "../../util/Constants";
import ChangeRecord from "../../model/changetracking/ChangeRecord";

jest.mock("../../util/Routing");
jest.mock("../../util/Ajax", () => ({
    default: jest.fn(),
    content: jest.requireActual("../../util/Ajax").content,
    params: jest.requireActual("../../util/Ajax").params,
    param: jest.requireActual("../../util/Ajax").param,
    accept: jest.requireActual("../../util/Ajax").accept,
    contentType: jest.requireActual("../../util/Ajax").contentType,
    formData: jest.requireActual("../../util/Ajax").formData
}));

const mockStore = configureMockStore<TermItState>([thunk]);

describe("AsyncTermActions", () => {

    let store: MockStoreEnhanced<TermItState>;

    beforeEach(() => {
        jest.clearAllMocks();
        store = mockStore(new TermItState());
    });

    describe("loadTermHistory", () => {

        const namespace = VocabularyUtils.NS_TERMIT;
        const termName = "test-term";

        it("requests history from REST endpoint for specified term", () => {
            Ajax.get = jest.fn().mockResolvedValue({});
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadTermHistory(VocabularyUtils.create(namespace + termName)))).then(() => {
                expect(Ajax.get).toHaveBeenCalled();
                const args = (Ajax.get as jest.Mock).mock.calls[0];
                expect(args[0]).toEqual(`${Constants.API_PREFIX}/terms/${termName}/history`);
                expect(args[1].getParams().namespace).toEqual(namespace);
            });
        });

        it("maps returned data to change record instances", () => {
            Ajax.get = jest.fn().mockResolvedValue(require("../../rest-mock/termHistory.json"));
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadTermHistory(VocabularyUtils.create(namespace + termName)))).then((records: ChangeRecord[]) => {
                expect(records.length).toBeGreaterThan(0);
                records.forEach(r => {
                    expect(r).toBeInstanceOf(ChangeRecord);
                });
            });
        });

        it("returns empty array on AJAX error", () => {
            Ajax.get = jest.fn().mockResolvedValue({status: 500});
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadTermHistory(VocabularyUtils.create(namespace + termName)))).then((records: ChangeRecord[]) => {
                expect(records).toBeDefined();
                expect(records.length).toEqual(0);
            });
        });
    });
});
