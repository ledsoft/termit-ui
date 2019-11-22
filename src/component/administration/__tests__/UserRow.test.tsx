import * as React from "react";
import Generator from "../../../__tests__/environment/Generator";
import {shallow} from "enzyme";
import {UserActions, UserRow} from "../UserRow";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import User from "../../../model/User";
import Utils from "../../../util/Utils";
import VocabularyUtils from "../../../util/VocabularyUtils";

describe("UserRow", () => {

    let user: User;
    let actions: UserActions;

    beforeEach(() => {
        user = Generator.generateUser();
        actions = {
            disable: jest.fn(),
            enable: jest.fn()
        };
    });

    it("renders disable button for enabled user", () => {
        const wrapper = shallow(<UserRow user={user} actions={actions} {...intlFunctions()}/>);
        expect(wrapper.exists(`#user-${Utils.hashCode(user.iri)}-disable`)).toBeTruthy();
    });

    it("renders enable button for disabled user", () => {
        user.types.push(VocabularyUtils.USER_DISABLED);
        const wrapper = shallow(<UserRow user={user} actions={actions} {...intlFunctions()}/>);
        expect(wrapper.exists(`#user-${Utils.hashCode(user.iri)}-disable`)).toBeFalsy();
        expect(wrapper.exists(`#user-${Utils.hashCode(user.iri)}-enable`)).toBeTruthy();
    });

    it("invokes disable action when disable button is clicked", () => {
        const wrapper = shallow(<UserRow user={user} actions={actions} {...intlFunctions()}/>);
        const button = wrapper.find(`#user-${Utils.hashCode(user.iri)}-disable`);
        expect(button.exists()).toBeTruthy();
        button.simulate("click");
        expect(actions.disable).toHaveBeenCalledWith(user);
    });

    it("invokes enable action when enable button is clicked", () => {
        user.types.push(VocabularyUtils.USER_DISABLED);
        const wrapper = shallow(<UserRow user={user} actions={actions} {...intlFunctions()}/>);
        const button = wrapper.find(`#user-${Utils.hashCode(user.iri)}-enable`);
        expect(button.exists()).toBeTruthy();
        button.simulate("click");
        expect(actions.enable).toHaveBeenCalledWith(user);
    });
});
