import * as React from "react";
import {intlDataForShallow, mountWithIntl} from "../../../__tests__/environment/Environment";
import {Register} from "../Register";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import ErrorInfo from "../../../model/ErrorInfo";
import Routing from "../../../util/Routing";
import Routes from "../../../util/Routes";
import {Alert, Button} from "reactstrap";
import {ReactWrapper, shallow} from "enzyme";
import ActionType, {AsyncFailureAction, MessageAction} from "../../../action/ActionType";
import Ajax, {params} from "../../../util/Ajax";
import Constants from "../../../util/Constants";
import Authentication from "../../../util/Authentication";

jest.mock("../../../util/Routing");
jest.mock("../../../util/Ajax");
jest.mock("../../../util/Authentication");

describe("Registration", () => {

    const userInfo = {
        firstName: "a",
        lastName: "b",
        username: "c",
        password: "d"
    };

    let register: ({}) => Promise<MessageAction | AsyncFailureAction>;

    beforeEach(() => {
        register = jest.fn().mockImplementation(() => Promise.resolve({type: ActionType.LOGIN}));
        Ajax.get = jest.fn().mockImplementation(() => Promise.resolve({
            data: false
        }));
        Ajax.post = jest.fn().mockImplementation(() => Promise.resolve());
    });

    it("navigates to login route on cancel", () => {
        const wrapper = mountWithIntl(<Register loading={false} register={register} {...intlFunctions()}/>);
        const cancelButton = wrapper.find("button.register-cancel");
        cancelButton.simulate("click");
        expect(Routing.transitionTo).toHaveBeenCalledWith(Routes.login);
    });

    it("displays submit button disabled when inputs are empty", () => {
        const wrapper = mountWithIntl(<Register loading={false} register={register} {...intlFunctions()}/>);
        const submitButton = wrapper.find(Button).first();
        expect(submitButton.getElement().props.disabled).toBeTruthy();
    });

    it("enables submit button when inputs are nonempty", () => {
        const wrapper = mountWithIntl(<Register loading={false} register={register} {...intlFunctions()}/>);
        fillBasicUserInfo(wrapper);
        fillPasswords(wrapper);
        const submitButton = wrapper.find(Button).first();
        expect(submitButton.getElement().props.disabled).toBeFalsy();
    });

    function fillBasicUserInfo(wrapper: ReactWrapper): void {
        const firstNameInput = wrapper.find("input[name=\"firstName\"]");
        (firstNameInput.getDOMNode() as HTMLInputElement).value = userInfo.firstName;
        firstNameInput.simulate("change", firstNameInput);
        const lastNameInput = wrapper.find("input[name=\"lastName\"]");
        (lastNameInput.getDOMNode() as HTMLInputElement).value = userInfo.lastName;
        lastNameInput.simulate("change", lastNameInput);
        const usernameInput = wrapper.find("input[name=\"username\"]");
        (usernameInput.getDOMNode() as HTMLInputElement).value = userInfo.username;
        usernameInput.simulate("change", usernameInput);
    }

    function fillPasswords(wrapper: ReactWrapper, different: boolean = false): void {
        const passwordInput = wrapper.find("input[name=\"password\"]");
        (passwordInput.getDOMNode() as HTMLInputElement).value = userInfo.password;
        passwordInput.simulate("change", passwordInput);
        const passwordConfirmInput = wrapper.find("input[name=\"passwordConfirm\"]");
        (passwordConfirmInput.getDOMNode() as HTMLInputElement).value = different ? "diff" : userInfo.password;
        passwordConfirmInput.simulate("change", passwordConfirmInput);
    }

    it("disables submit button when passwords do not match", () => {
        const wrapper = mountWithIntl(<Register loading={false} register={register} {...intlFunctions()}/>);
        fillBasicUserInfo(wrapper);
        fillPasswords(wrapper, true);
        const submitButton = wrapper.find(Button).first();
        expect(submitButton.getElement().props.disabled).toBeTruthy();
    });

    it("submits user for registration on register click", () => {
        const wrapper = mountWithIntl(<Register loading={false} register={register} {...intlFunctions()}/>);
        fillBasicUserInfo(wrapper);
        fillPasswords(wrapper);
        const submitButton = wrapper.find(Button).first();
        submitButton.simulate("click");
        expect(register).toHaveBeenCalledWith(userInfo);
    });

    it("disables submit button when loading", () => {
        const wrapper = mountWithIntl(<Register loading={true} register={register} {...intlFunctions()}/>);
        fillBasicUserInfo(wrapper);
        fillPasswords(wrapper);
        const submitButton = wrapper.find(Button).first();
        expect(submitButton.getElement().props.disabled).toBeTruthy();
    });

    it("renders alert with error info", () => {
        const error = new ErrorInfo(ActionType.REGISTER, {
            message: "Error"
        });
        const wrapper = mountWithIntl(<Register loading={false} register={register} {...intlFunctions()}/>);
        (wrapper.find(Register).instance() as Register).setState({error});
        wrapper.update();
        expect(wrapper.find(Alert).exists()).toBeTruthy();
    });

    it("clears error on change", () => {
        const error = new ErrorInfo(ActionType.REGISTER, {
            message: "Error"
        });
        const wrapper = shallow(<Register loading={false}
                                          register={register} {...intlFunctions()} {...intlDataForShallow()}/>);
        (wrapper.instance() as Register).setState({error});
        wrapper.update();
        // @ts-ignore
        (wrapper.instance() as Register).onChange({currentTarget: {name: "firstName", value: userInfo.firstName}});
        wrapper.update();
        expect((wrapper.instance() as Register).state.error).toBeNull();
    });

    it("checks for username existence on username field edit", () => {
        const wrapper = mountWithIntl(<Register loading={false} register={register} {...intlFunctions()}/>);
        const usernameInput = wrapper.find("input[name=\"username\"]");
        (usernameInput.getDOMNode() as HTMLInputElement).value = userInfo.username;
        usernameInput.simulate("change", usernameInput);
        expect(Ajax.get).toHaveBeenCalledWith(Constants.API_PREFIX + "/users/username", params({username: userInfo.username}));
    });

    it("clears potentially existing JWT on mount", () => {
        mountWithIntl(<Register loading={false} register={register} {...intlFunctions()}/>);
        expect(Authentication.clearToken).toHaveBeenCalled();
    });
});