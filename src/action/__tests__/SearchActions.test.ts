import configureMockStore, {MockStoreEnhanced} from "redux-mock-store";
import TermItState from "../../model/TermItState";
import thunk from "redux-thunk";
import Ajax from "../../util/Ajax";
import {ThunkDispatch} from "../../util/Types";
import {AsyncAction} from "../ActionType";
import SearchResult from "../../model/SearchResult";
import Vocabulary2 from "../../util/VocabularyUtils";
import {search} from "../SearchActions";

jest.mock("../../util/Routing");
jest.mock("../../util/Ajax", () => ({
    default: jest.fn(),
    content: require.requireActual("../../util/Ajax").content,
    params: require.requireActual("../../util/Ajax").params,
    param: require.requireActual("../../util/Ajax").param,
    accept: require.requireActual("../../util/Ajax").accept,
}));

const mockStore = configureMockStore<TermItState>([thunk]);

describe("SearchActions", () => {

    let store: MockStoreEnhanced<TermItState>;

    beforeEach(() => {
        store = mockStore(new TermItState());
    });

    describe("search", () => {
        it("emits search request action with ignore loading switch", () => {
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve([]));
            return Promise.resolve((store.dispatch as ThunkDispatch)(search("test", true))).then(() => {
                const searchRequestAction: AsyncAction = store.getActions()[0];
                expect(searchRequestAction.ignoreLoading).toBeTruthy();
            });
        });

        it("compacts incoming JSON-LD data using SearchResult context", () => {
            const results = require("../../rest-mock/searchResults");
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(results));
            return Promise.resolve((store.dispatch as ThunkDispatch)(search("test", true))).then(() => {
                const action = store.getActions()[1];
                const result = action.searchResults;
                expect(Array.isArray(result)).toBeTruthy();
                result.forEach((r: SearchResult) => {
                    expect(r.iri).toBeDefined();
                    expect(r.label).toBeDefined();
                    if (r.hasType(Vocabulary2.TERM)) {
                        expect(r.vocabulary).toBeDefined();
                    }
                })
            });
        });
    });
});