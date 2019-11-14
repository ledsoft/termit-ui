import * as React from "react";
import User from "../../../model/User";
import {Users} from "../Users";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import {flushPromises, mountWithIntl} from "../../../__tests__/environment/Environment";
import Generator from "../../../__tests__/environment/Generator";
import UserRow from "../UserRow";
import {act} from "react-dom/test-utils";

/**
 * Note that the tests here are a bit convoluted since Enzyme still has trouble supporting React Hooks.
 *
 * First, shallow rendering does not work with the useEffect hook basically at all
 *
 * With regular mount, React issues a warning about having to wrap actions on hooks in an act() call. But even with it,
 * the warning remains. Therefore, there is the act-flushPromises part which works around it.
 */
describe("Users", () => {

    let loadUsers: () => Promise<User[]>;

    beforeEach(() => {
        loadUsers = jest.fn().mockImplementation(() => Promise.resolve([]));
    });

    it("loads users on mount", async () => {
        mountWithIntl(<Users loadUsers={loadUsers} {...intlFunctions()}/>);
        await act(async () => {
            await flushPromises();
        });
        expect(loadUsers).toHaveBeenCalled();
    });

    it("renders loaded users as table rows", async () => {
        const users = [Generator.generateUser(), Generator.generateUser()];
        loadUsers = jest.fn().mockImplementation(() => Promise.resolve(users));
        const wrapper = mountWithIntl(<Users loadUsers={loadUsers} {...intlFunctions()}/>);

        await act(async () => {
            await flushPromises();
        });

        wrapper.update();
        const rows = wrapper.find(UserRow);
        expect(rows.length).toEqual(users.length);
    });
});
