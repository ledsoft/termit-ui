import * as React from "react";
import {MainView} from "../MainView";
import User, {EMPTY_USER} from "../../model/User";
import {intlFunctions} from "../../__tests__/environment/IntlUtil";
import {shallow} from "enzyme";
import createMemoryHistory from "history/createMemoryHistory";
import {intlDataForShallow, mountWithIntl} from "../../__tests__/environment/Environment";

describe("MainView", () => {

    const location = {
        pathname: "/",
        search: "",
        hash: "",
        state: {}
    };
    const history = createMemoryHistory();
    const match = {
        params: {},
        path: "/",
        isExact: true,
        url: "http://localhost:3000/"
    };

    let loadUser: () => void;
    let logout: () => void;

    beforeEach(() => {
        loadUser = jest.fn();
        logout = jest.fn();
    });

    it("loads user on mount", () => {
        shallow(<MainView user={EMPTY_USER} loadUser={loadUser} logout={logout} history={history} location={location} match={match} {...intlFunctions()} {...intlDataForShallow()}/>);
        expect(loadUser).toHaveBeenCalled();
    });

    it("does not load user when it is already present in store", () => {
        const user = new User({
            firstName: "Catherine",
            lastName: "Halsey",
            username: "halsey@unsc.org",
            iri: "http://onto.fel.cvut.cz/ontologies/termit/catherine-halsey"
        });
        shallow(<MainView user={user} loadUser={loadUser} logout={logout} history={history} location={location} match={match} {...intlFunctions()} {...intlDataForShallow()}/>);
        expect(loadUser).not.toHaveBeenCalled();
    });

    it("renders placeholder UI when user is being loaded", () => {
        const wrapper = mountWithIntl(<MainView user={EMPTY_USER} loadUser={loadUser} logout={logout} history={history} location={location} match={match} {...intlFunctions()} {...intlDataForShallow()}/>);
        expect(wrapper.find("header").exists()).toBeFalsy();
    });
});