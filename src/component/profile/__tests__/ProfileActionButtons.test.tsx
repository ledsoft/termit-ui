import * as React from "react";

import ProfileActionButtons from "../ProfileActionButtons";
import {mountWithIntl} from "../../../__tests__/environment/Environment";
import {ButtonToolbar} from "reactstrap";
import {GoKey, GoPencil} from "react-icons/go";

describe("ProfileActionButtons", () => {

    let showProfileEdit: () => void;
    let navigateToChangePasswordRoute: () => void;
    let edit: boolean;

    beforeEach(() => {
        showProfileEdit = jest.fn();
        navigateToChangePasswordRoute = jest.fn();
        edit = false;
    });

    it("correctly renders component if !edit", () => {
        const wrapper = mountWithIntl(<ProfileActionButtons
            edit={edit}
            showProfileEdit={showProfileEdit}
            navigateToChangePasswordRoute={navigateToChangePasswordRoute}/>);
        const buttonToolbar = wrapper.find(ButtonToolbar);
        const buttons = buttonToolbar.find("button");
        const buttonEditLabel = buttonToolbar.find("button#profile-edit").find(GoPencil);
        const buttonChangePasswordLabel = buttonToolbar.find("button#profile-change-password").find(GoKey);

        // expect(buttonToolbar.length).toEqual(1);
        expect(buttons.length).toEqual(2);
        expect(buttonEditLabel.length).toEqual(1);
        expect(buttonChangePasswordLabel.length).toEqual(1);
    });

    it("correctly renders component if edit", () => {
        const wrapper = mountWithIntl(<ProfileActionButtons
            edit={true}
            showProfileEdit={showProfileEdit}
            navigateToChangePasswordRoute={navigateToChangePasswordRoute}/>);
        const buttonToolbar = wrapper.find(ButtonToolbar);
        const buttons = buttonToolbar.find("button");

        expect(buttonToolbar.length).toEqual(1);
        expect(buttons.length).toEqual(0);
    });

    it("calls navigateToChangePassword route on change password button click", () => {
        const wrapper = mountWithIntl(<ProfileActionButtons
            edit={edit}
            showProfileEdit={showProfileEdit}
            navigateToChangePasswordRoute={navigateToChangePasswordRoute}/>);

        wrapper.find("button#profile-change-password").simulate("click");
        expect(navigateToChangePasswordRoute).toHaveBeenCalled();
    });

    it("calls showProfileEdit route on edit profile button click", () => {
        const wrapper = mountWithIntl(<ProfileActionButtons
            edit={edit}
            showProfileEdit={showProfileEdit}
            navigateToChangePasswordRoute={navigateToChangePasswordRoute}/>);

        wrapper.find("button#profile-edit").simulate("click");
        expect(showProfileEdit).toHaveBeenCalled();
    });
});