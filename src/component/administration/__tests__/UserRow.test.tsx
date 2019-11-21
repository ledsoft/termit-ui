import * as React from "react";
import Generator from "../../../__tests__/environment/Generator";
import {shallow} from "enzyme";
import {UserRow} from "../UserRow";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import User from "../../../model/User";
import Utils from "../../../util/Utils";
import VocabularyUtils from "../../../util/VocabularyUtils";

describe("UserRow", () => {

    let user: User;

    beforeEach(() => {
        user = Generator.generateUser();
    });

    it("renders disable button for enabled user", () => {
        const wrapper = shallow(<UserRow user={user} {...intlFunctions()}/>);
        expect(wrapper.exists(`#user-${Utils.hashCode(user.iri)}-disable`)).toBeTruthy();
    });

    it("renders enable button for disabled user", () => {
        user.types.push(VocabularyUtils.USER_DISABLED);
        const wrapper = shallow(<UserRow user={user} {...intlFunctions()}/>);
        expect(wrapper.exists(`#user-${Utils.hashCode(user.iri)}-disable`)).toBeFalsy();
        expect(wrapper.exists(`#user-${Utils.hashCode(user.iri)}-enable`)).toBeTruthy();
    });
});
