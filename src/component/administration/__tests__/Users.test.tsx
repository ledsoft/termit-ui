import * as React from "react";
import User from "../../../model/User";
import {Users} from "../Users";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import Generator from "../../../__tests__/environment/Generator";
import UserRow from "../UserRow";
import {shallow} from "enzyme";

describe("Users", () => {

    const currentUser = Generator.generateUser();

    let loadUsers: () => Promise<User[]>;
    let disableUser: (user: User) => Promise<any>;
    let enableUser: (user: User) => Promise<any>;

    beforeEach(() => {
        loadUsers = jest.fn().mockImplementation(() => Promise.resolve([]));
        disableUser = jest.fn().mockImplementation(() => Promise.resolve());
        enableUser = jest.fn().mockImplementation(() => Promise.resolve());
    });

    it("loads users on mount", async () => {
        shallow(<Users loadUsers={loadUsers} disableUser={disableUser} enableUser={enableUser} currentUser={currentUser} {...intlFunctions()}/>);
        expect(loadUsers).toHaveBeenCalled();
    });

    it("renders loaded users as table rows", async () => {
        const users = [Generator.generateUser(), Generator.generateUser()];
        loadUsers = jest.fn().mockImplementation(() => Promise.resolve(users));
        const wrapper = shallow<Users>(<Users loadUsers={loadUsers} disableUser={disableUser} currentUser={currentUser}
                                              enableUser={enableUser}  {...intlFunctions()}/>);

        return Promise.resolve().then(() => {
            wrapper.update();
            const rows = wrapper.find(UserRow);
            expect(rows.length).toEqual(users.length);
        });
    });

    it("disables user and reloads all users on finish", () => {
        const users = [Generator.generateUser(), Generator.generateUser()];
        loadUsers = jest.fn().mockImplementation(() => Promise.resolve(users));
        const wrapper = shallow<Users>(<Users loadUsers={loadUsers} disableUser={disableUser} currentUser={currentUser}
                                              enableUser={enableUser} {...intlFunctions()}/>);

        wrapper.instance().disableUser(users[0]);
        return Promise.resolve().then(() => {
            expect(disableUser).toHaveBeenCalledWith(users[0]);
            expect(loadUsers).toHaveBeenCalledTimes(2);
        });
    });

    it("enables user and reloads all users on finish", () => {
        const users = [Generator.generateUser(), Generator.generateUser()];
        loadUsers = jest.fn().mockImplementation(() => Promise.resolve(users));
        const wrapper = shallow<Users>(<Users loadUsers={loadUsers} disableUser={disableUser} currentUser={currentUser}
                                              enableUser={enableUser} {...intlFunctions()}/>);

        wrapper.instance().enableUser(users[0]);
        return Promise.resolve().then(() => {
            expect(enableUser).toHaveBeenCalledWith(users[0]);
            expect(loadUsers).toHaveBeenCalledTimes(2);
        });
    });

    it("passes info to row about whether rendered user is the currently logged in user", () => {
        const users = [Generator.generateUser(), Generator.generateUser(), currentUser];
        loadUsers = jest.fn().mockImplementation(() => Promise.resolve(users));
        const wrapper = shallow<Users>(<Users loadUsers={loadUsers} disableUser={disableUser} currentUser={currentUser}
                                              enableUser={enableUser} {...intlFunctions()}/>);
        return Promise.resolve().then(() => {
            const rows = wrapper.find(UserRow);
            expect(rows.at(0).prop("currentUser")).toBeFalsy();
            expect(rows.at(2).prop("currentUser")).toBeTruthy();
        });
    });
});
