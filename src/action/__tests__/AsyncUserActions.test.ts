import configureMockStore, {MockStoreEnhanced} from "redux-mock-store";
import TermItState from "../../model/TermItState";
import thunk from "redux-thunk";
import Constants from "../../util/Constants";
import Ajax from "../../util/Ajax";
import {ThunkDispatch} from "../../util/Types";
import User from "../../model/User";
import {disableUser, enableUser, loadUsers} from "../AsyncUserActions";
import VocabularyUtils from "../../util/VocabularyUtils";
import Generator from "../../__tests__/environment/Generator";
import ActionType from "../ActionType";
import MessageType from "../../model/MessageType";

jest.mock("../../util/Routing");
jest.mock("../../util/Ajax", () => ({
    default: jest.fn(),
    content: require.requireActual("../../util/Ajax").content,
    params: require.requireActual("../../util/Ajax").params,
    param: require.requireActual("../../util/Ajax").param,
    accept: require.requireActual("../../util/Ajax").accept,
    contentType: require.requireActual("../../util/Ajax").contentType,
    formData: require.requireActual("../../util/Ajax").formData
}));

const mockStore = configureMockStore<TermItState>([thunk]);

describe("AsyncUserActions", () => {

    const name = "test-user";
    const namespace = VocabularyUtils.NS_TERMIT + "users/";

    let store: MockStoreEnhanced<TermItState>;

    beforeEach(() => {
        jest.clearAllMocks();
        store = mockStore(new TermItState());
    });

    describe("loadUsers", () => {
        it("sends GET request to server REST API", () => {
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(require("../../rest-mock/users.json")));
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadUsers())).then(() => {
                expect(Ajax.get).toHaveBeenCalled();
                const url = (Ajax.get as jest.Mock).mock.calls[0][0];
                expect(url).toEqual(Constants.API_PREFIX + "/users");
            });
        });

        it("returns loaded users on success", () => {
            const users = require("../../rest-mock/users.json");
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(users));
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadUsers())).then((result:User[]) => {
                expect(result.length).toEqual(users.length);
                result.forEach(u => expect(users.find((uu: object) => uu["@id"] === u.iri)).toBeDefined());
            });
        });

        it("returns empty array on error", () => {
            Ajax.get = jest.fn().mockImplementation(() => Promise.reject({message: "Error"}));
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadUsers())).then((result:User[]) => {
                expect(result).toBeDefined();
                expect(result.length).toEqual(0);
            });
        });
    });

    describe("disableUser", () => {
        it("sends DELETE request with provided user identifier to server REST API", () => {
            const user = Generator.generateUser(namespace + name);
            Ajax.delete = jest.fn().mockImplementation(() => Promise.resolve());
            return Promise.resolve((store.dispatch as ThunkDispatch)(disableUser(user))).then(() => {
                expect(Ajax.delete).toHaveBeenCalled();
                const url = (Ajax.delete as jest.Mock).mock.calls[0][0];
                expect(url).toEqual(`${Constants.API_PREFIX}/users/${name}/status`);
                const config = (Ajax.delete as jest.Mock).mock.calls[0][1];
                expect(config.getParams().namespace).toEqual(namespace);
            });
        });

        it("publishes message on success", () => {
            const user = Generator.generateUser(namespace + name);
            Ajax.delete = jest.fn().mockImplementation(() => Promise.resolve());
            return Promise.resolve((store.dispatch as ThunkDispatch)(disableUser(user))).then(() => {
                const actions = store.getActions();
                const lastAction = actions[actions.length - 1];
                expect(lastAction.type).toEqual(ActionType.PUBLISH_MESSAGE);
                expect(lastAction.message.type).toEqual(MessageType.SUCCESS);
            });
        });
    });

    describe("enableUser", () => {
        it("sends POSt request with provided user identifier to server REST API", () => {
            const user = Generator.generateUser(namespace + name);
            Ajax.post = jest.fn().mockImplementation(() => Promise.resolve());
            return Promise.resolve((store.dispatch as ThunkDispatch)(enableUser(user))).then(() => {
                expect(Ajax.post).toHaveBeenCalled();
                const url = (Ajax.post as jest.Mock).mock.calls[0][0];
                expect(url).toEqual(`${Constants.API_PREFIX}/users/${name}/status`);
                const config = (Ajax.post as jest.Mock).mock.calls[0][1];
                expect(config.getParams().namespace).toEqual(namespace);
            });
        });

        it("publishes message on success", () => {
            const user = Generator.generateUser(namespace + name);
            Ajax.delete = jest.fn().mockImplementation(() => Promise.resolve());
            return Promise.resolve((store.dispatch as ThunkDispatch)(enableUser(user))).then(() => {
                const actions = store.getActions();
                const lastAction = actions[actions.length - 1];
                expect(lastAction.type).toEqual(ActionType.PUBLISH_MESSAGE);
                expect(lastAction.message.type).toEqual(MessageType.SUCCESS);
            });
        });
    });
});
