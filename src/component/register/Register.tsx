import * as React from 'react';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {injectIntl} from 'react-intl';
// import {Alert, Button, Form, FormControl, FormControlProps, Panel} from 'react-bootstrap';
// import Input from '../misc/HorizontalInput';
import './Register.scss';
// import Mask from "../misc/Mask";
import ErrorInfo from "../../model/ErrorInfo";
import {Panel} from "react-bootstrap";

interface RegisterProps extends HasI18n {
    loading: boolean,
    error: ErrorInfo,
    register: (user: {}) => void
    clearError: () => void
}

interface RegisterState {
    firstName: string,
    lastName: string,
    username: string,
    password: string,
    passwordConfirm: string
}

export class Register extends React.Component<RegisterProps, RegisterState> {
    constructor(props: RegisterProps) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            username: '',
            password: '',
            passwordConfirm: ''
        };
    }

    public render() {
        const i18n = this.props.i18n;
        return <Panel bsStyle='info' className='register-panel'>
            <Panel.Heading>
                <Panel.Title componentClass='h3'>{i18n('register.title')}</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
                TODO
            </Panel.Body>
        </Panel>;
    }
}

export default injectIntl(withI18n(Register));
