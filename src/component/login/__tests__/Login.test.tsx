import * as React from 'react';
import {mount} from 'enzyme';
import {Login} from '../Login';
import ErrorInfo, {EMPTY_ERROR} from "../../../model/ErrorInfo";
import {formatMessage, i18n} from "../../../__tests__/environment/IntlUtil";
import ActionType from "../../../action/ActionType";
import {Alert} from "react-bootstrap";

jest.mock('../../../util/Routing');

describe('Login', () => {

    let login: (username: string, password: string) => void;
    let clearError: () => void;

    beforeEach(() => {
        login = jest.fn();
        clearError = jest.fn();
    });

    it('renders submit button disabled when either field is empty', () => {
        const wrapper = mount(<Login loading={false} error={EMPTY_ERROR} login={login} clearError={clearError}
                                     i18n={i18n} formatMessage={formatMessage}/>);
        const button = wrapper.find('[bsStyle="success"]');
        expect(button.getElement().props.disabled).toBeTruthy();
        const usernameInput = wrapper.find('input[name="username"]');
        const passwordInput = wrapper.find('input[name="password"]');
        (usernameInput.getDOMNode() as HTMLInputElement).value = 'aaaa';
        usernameInput.simulate('change', usernameInput);
        expect(button.getElement().props.disabled).toBeTruthy();
        (usernameInput.getDOMNode() as HTMLInputElement).value = '';
        usernameInput.simulate('change', usernameInput);
        (passwordInput.getDOMNode() as HTMLInputElement).value = 'aaaa';
        passwordInput.simulate('change', passwordInput);
        expect(button.getElement().props.disabled).toBeTruthy();
    });

    it('enables submit button when both fields are non-empty', () => {
        const wrapper = mount(<Login loading={false} error={EMPTY_ERROR} login={login} clearError={clearError}
                                     i18n={i18n} formatMessage={formatMessage}/>);
        const button = wrapper.find('[bsStyle="success"]');
        expect(button.getElement().props.disabled).toBeTruthy();
        const usernameInput = wrapper.find('input[name="username"]');
        const passwordInput = wrapper.find('input[name="password"]');
        (usernameInput.getDOMNode() as HTMLInputElement).value = 'aaaa';
        usernameInput.simulate('change', usernameInput);
        (passwordInput.getDOMNode() as HTMLInputElement).value = 'aaaa';
        passwordInput.simulate('change', passwordInput);
        expect(wrapper.find('[bsStyle="success"]').getElement().props.disabled).toBeFalsy();
    });

    it('invokes login when enter is pressed', () => {
        const wrapper = mount(<Login loading={false} error={EMPTY_ERROR} login={login} clearError={clearError}
                                     i18n={i18n} formatMessage={formatMessage}/>);
        const usernameInput = wrapper.find('input[name="username"]');
        const passwordInput = wrapper.find('input[name="password"]');
        (usernameInput.getDOMNode() as HTMLInputElement).value = 'aaaa';
        usernameInput.simulate('change', usernameInput);
        (passwordInput.getDOMNode() as HTMLInputElement).value = 'aaaa';
        passwordInput.simulate('change', passwordInput);
        passwordInput.simulate('keyPress', {key: 'Enter'});
        expect(login).toHaveBeenCalled();
    });

    it('does not invoke login when enter is pressed and one field is invalid', () => {
        const wrapper = mount(<Login loading={false} error={EMPTY_ERROR} login={login} clearError={clearError}
                                     i18n={i18n} formatMessage={formatMessage}/>);
        const usernameInput = wrapper.find('input[name="username"]');
        const passwordInput = wrapper.find('input[name="password"]');
        (usernameInput.getDOMNode() as HTMLInputElement).value = 'aaaa';
        usernameInput.simulate('change', usernameInput);
        passwordInput.simulate('keyPress', {key: 'Enter'});
        expect(login).not.toHaveBeenCalled();
    });

    it('renders alert with error when error is relevant', () => {
        const error = new ErrorInfo(ActionType.LOGIN_FAILURE, {});
        const wrapper = mount(<Login loading={false} error={error} login={login} clearError={clearError}
                                     i18n={i18n} formatMessage={formatMessage}/>);
        const alert = wrapper.find(Alert);
        expect(alert.exists()).toBeTruthy();
    });

    it('does not render alert when error is not relevant', () => {
        const error = new ErrorInfo(ActionType.FETCH_USER_FAILURE, {});
        const wrapper = mount(<Login loading={false} error={error} login={login} clearError={clearError}
                                     i18n={i18n} formatMessage={formatMessage}/>);
        const alert = wrapper.find(Alert);
        expect(alert.exists()).toBeFalsy();
    });

    it('clears error after user input', () => {
        const error = new ErrorInfo(ActionType.FETCH_USER_FAILURE, {});
        const wrapper = mount(<Login loading={false} error={error} login={login} clearError={clearError}
                                     i18n={i18n} formatMessage={formatMessage}/>);
        const usernameInput = wrapper.find('input[name="username"]');
        (usernameInput.getDOMNode() as HTMLInputElement).value = 'aaaa';
        usernameInput.simulate('change', usernameInput);
        expect(clearError).toHaveBeenCalled();
    });
});