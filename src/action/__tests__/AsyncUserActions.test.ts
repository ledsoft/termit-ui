import configureMockStore, {MockStoreEnhanced} from "redux-mock-store";
import TermItState from "../../model/TermItState";
import thunk from "redux-thunk";
import Constants from "../../util/Constants";
import Ajax from "../../util/Ajax";
import {ThunkDispatch} from "../../util/Types";
import User, {UserAccountData} from "../../model/User";
import {
    changePassword,
    disableUser,
    enableUser,
    loadUser,
    loadUsers,
    login, register,
    unlockUser,
    updateProfile
} from "../AsyncUserActions";
import VocabularyUtils from "../../util/VocabularyUtils";
import Generator from "../../__tests__/environment/Generator";
import ActionType, {AsyncAction, AsyncFailureAction, MessageAction} from "../ActionType";
import MessageType from "../../model/MessageType";
import AsyncActionStatus from "../AsyncActionStatus";
import {ErrorData} from "../../model/ErrorInfo";
import {Action} from "redux";
import Routing from "../../util/Routing";

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

    describe("fetch user", () => {
        it("does not publish error message when status is 401", () => {
            const error: ErrorData = {
                message: "Unauthorized",
                status: Constants.STATUS_UNAUTHORIZED
            };
            Ajax.get = jest.fn().mockImplementation(() => Promise.reject(error));
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadUser())).then(() => {
                const actions: Action[] = store.getActions();
                const found = actions.find(a => a.type === ActionType.PUBLISH_MESSAGE);
                return expect(found).not.toBeDefined();
            });
        });
    });

    describe("login", () => {
        it("transitions to home on login success", () => {
            const resp = {
                data: {
                    loggedIn: true
                },
                headers: {}
            };
            resp.headers[Constants.Headers.AUTHORIZATION] = "Bearer jwt12345";
            Ajax.post = jest.fn().mockImplementation(() => Promise.resolve(resp));
            return Promise.resolve((store.dispatch as ThunkDispatch)(login("test", "test"))).then(() => {
                expect(Routing.transitionToHome).toHaveBeenCalled();
            });
        });
    });

    describe("register", () => {

        const userInfo: UserAccountData = {
            firstName: "test",
            lastName: "testowitch",
            username: "admin",
            password: "iamtheboss"
        };

        it("invokes login on registration success", () => {
            Ajax.post = jest.fn().mockImplementation(() => Promise.resolve());
            return Promise.resolve((store.dispatch as ThunkDispatch)(register(userInfo))).then(() => {
                expect(store.getActions().find(a => a.type === ActionType.LOGIN)).toBeDefined();
            });
        });

        it("returns error info on error", () => {
            const message = "User already exists";
            Ajax.post = jest.fn().mockImplementation(() => Promise.reject({
                status: 409,
                message
            }));
            return Promise.resolve((store.dispatch as ThunkDispatch)(register(userInfo))).then(result => {
                expect(result.type).toEqual(ActionType.REGISTER);
                expect((result as AsyncFailureAction).error).toBeDefined();
                expect((result as AsyncFailureAction).error.message).toEqual(message);
            });
        });
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
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadUsers())).then((result: User[]) => {
                expect(result.length).toEqual(users.length);
                result.forEach(u => expect(users.find((uu: object) => uu["@id"] === u.iri)).toBeDefined());
            });
        });

        it("returns empty array on error", () => {
            Ajax.get = jest.fn().mockImplementation(() => Promise.reject({message: "Error"}));
            return Promise.resolve((store.dispatch as ThunkDispatch)(loadUsers())).then((result: User[]) => {
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
        it("sends POST request with provided user identifier to server REST API", () => {
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

    describe("unlockUser", () => {
        it("sends request with new user password to corresponding REST endpoint", () => {
            const user = Generator.generateUser(namespace + name);
            const newPassword = "new_password";
            Ajax.delete = jest.fn().mockImplementation(() => Promise.resolve());
            return Promise.resolve((store.dispatch as ThunkDispatch)(unlockUser(user, newPassword))).then(() => {
                expect(Ajax.delete).toHaveBeenCalled();
                const url = (Ajax.delete as jest.Mock).mock.calls[0][0];
                expect(url).toEqual(`${Constants.API_PREFIX}/users/${name}/lock`);
                const config = (Ajax.delete as jest.Mock).mock.calls[0][1];
                expect(config.getContent()).toEqual(newPassword);
                expect(config.getParams().namespace).toEqual(namespace);
                expect(config.getContentType()).toEqual(Constants.TEXT_MIME_TYPE);
            });
        });

        it("publishes message on success", () => {
            const user = Generator.generateUser(namespace + name);
            const newPassword = "new_password";
            Ajax.delete = jest.fn().mockImplementation(() => Promise.resolve());
            return Promise.resolve((store.dispatch as ThunkDispatch)(unlockUser(user, newPassword))).then(() => {
                const actions = store.getActions();
                const lastAction = actions[actions.length - 1];
                expect(lastAction.type).toEqual(ActionType.PUBLISH_MESSAGE);
                expect(lastAction.message.type).toEqual(MessageType.SUCCESS);
            });
        });
    });

    describe("update profile", () => {
        it("sends put request to correct endpoint using user IRI", () => {
            const user = new User({
                iri: namespace + name,
                username: name,
                firstName: "test",
                lastName: "test"
            });
            const mock = jest.fn().mockImplementation(() => Promise.resolve());
            Ajax.put = mock;
            return Promise.resolve((store.dispatch as ThunkDispatch)(updateProfile(user))).then(() => {
                expect(Ajax.put).toHaveBeenCalled();
                const requestUri = mock.mock.calls[0][0];
                expect(requestUri).toEqual(Constants.API_PREFIX + "/users/current");
            });
        });

        it("sends JSON-LD of user argument to REST endpoint", () => {
            const user = new User({
                iri: namespace + name,
                username: name,
                firstName: "test",
                lastName: "test"
            });
            const mock = jest.fn().mockImplementation(() => Promise.resolve());
            Ajax.put = mock;
            return Promise.resolve((store.dispatch as ThunkDispatch)(updateProfile(user))).then(() => {
                expect(Ajax.put).toHaveBeenCalled();
                const data = mock.mock.calls[0][1].getContent();
                expect(data).toEqual(user.toJsonLd());
            });
        });

        it("updates user on successful request", () => {
            const user = new User({
                iri: namespace + name,
                username: name,
                firstName: "test",
                lastName: "test"
            });
            Ajax.put = jest.fn().mockImplementation(() => Promise.resolve());
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve());
            return Promise.resolve((store.dispatch as ThunkDispatch)(updateProfile(user))).then(() => {
                // 0 - async request, 1 - fetch user, 2 - fetch user success, 3 - publish message, 4 - request success
                const action: AsyncAction = store.getActions()[4];
                expect(action).toBeDefined();
                expect(action.type).toEqual(ActionType.UPDATE_PROFILE);
            });
        });

        it("dispatches success message on successful profile update", () => {
            const user = new User({
                iri: namespace + name,
                username: name,
                firstName: "test",
                lastName: "test"
            });
            Ajax.put = jest.fn().mockImplementation(() => Promise.resolve());
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve());
            return Promise.resolve((store.dispatch as ThunkDispatch)(updateProfile(user))).then(() => {
                // 0 - async request, 1 - fetch user, 2 - fetch user success, 3 - publish message, 4 - request success
                const action: MessageAction = store.getActions()[3];
                expect(action).toBeDefined();
                expect(action.message.messageId).toEqual("profile.updated.message");
            });
        });
    });

    describe("change password", () => {

        beforeEach(() => {
            Ajax.get = jest.fn().mockImplementation(() => Promise.resolve({}));
        });

        it("sends put request to correct endpoint using user IRI", () => {
            const userWithPassword = new User({
                iri: namespace + name,
                username: name,
                firstName: "test",
                lastName: "test",
                password: "test",
                originalPassword: "test-original"
            });
            const mock = jest.fn().mockImplementation(() => Promise.resolve());
            Ajax.put = mock;
            return Promise.resolve((store.dispatch as ThunkDispatch)(changePassword(userWithPassword))).then(() => {
                expect(Ajax.put).toHaveBeenCalled();
                const requestUri = mock.mock.calls[0][0];
                expect(requestUri).toEqual(Constants.API_PREFIX + "/users/current");
            });
        });

        it("sends JSON-LD of user argument to REST endpoint", () => {
            const userWithPassword = new User({
                iri: namespace + name,
                username: name,
                firstName: "test",
                lastName: "test",
                password: "test",
                originalPassword: "test-original"
            });
            const mock = jest.fn().mockImplementation(() => Promise.resolve());
            Ajax.put = mock;
            return Promise.resolve((store.dispatch as ThunkDispatch)(changePassword(userWithPassword))).then(() => {
                expect(Ajax.put).toHaveBeenCalled();
                const data = mock.mock.calls[0][1].getContent();
                expect(data).toEqual(userWithPassword.toJsonLd());
            });
        });

        it("updates password on successful request", () => {
            const userWithPassword = new User({
                iri: namespace + name,
                username: name,
                firstName: "test",
                lastName: "test",
                password: "test",
                originalPassword: "test-original"
            });
            Ajax.put = jest.fn().mockImplementation(() => Promise.resolve());
            return Promise.resolve((store.dispatch as ThunkDispatch)(changePassword(userWithPassword))).then(() => {
                const action: AsyncAction = store.getActions().find(a => a.type === ActionType.CHANGE_PASSWORD && a.status === AsyncActionStatus.SUCCESS);
                expect(action).toBeDefined();
            });
        });

        it("dispatches success message on successful password update", () => {
            const userWithPassword = new User({
                iri: namespace + name,
                username: name,
                firstName: "test",
                lastName: "test",
                password: "test",
                originalPassword: "test-original"
            });
            Ajax.put = jest.fn().mockImplementation(() => Promise.resolve());
            return Promise.resolve((store.dispatch as ThunkDispatch)(changePassword(userWithPassword))).then(() => {
                const action: MessageAction = store.getActions().find(a => a.type === ActionType.PUBLISH_MESSAGE);
                expect(action).toBeDefined();
                expect(action.message.messageId).toEqual("change-password.updated.message");
            });
        });
    });
});
