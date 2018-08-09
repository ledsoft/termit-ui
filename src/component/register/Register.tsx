import * as React from 'react';
import {injectIntl} from 'react-intl';
import {Alert, Button, ButtonToolbar, Form, FormControl, FormControlProps, Panel} from 'react-bootstrap';
import withI18n, {HasI18n} from '../hoc/withI18n';
import ErrorInfo from '../../model/ErrorInfo';
import HorizontalInput from '../misc/HorizontalInput';
import './Register.scss';
import Routes from '../../util/Routes';
import Routing from '../../util/Routing';
import Mask from "../misc/Mask";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {ThunkDispatch} from "redux-thunk";
import {Action} from "redux";
import {clearError} from "../../action/SyncActions";
import ActionType from "../../action/ActionType";
import {register} from "../../action/ComplexActions";

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

    private onChange = (e: React.FormEvent<FormControlProps>) => {
        this.props.clearError();
        const newState = Object.assign({}, this.state);
        newState[e.currentTarget.name!] = e.currentTarget.value;
        this.setState(newState);
    };

    private onKeyPress = (e: React.KeyboardEvent<FormControl>) => {
        if (e.key === 'Enter' && this.isValid()) {
            this.onRegister();
        }
    };

    private isValid(): boolean {
        return this.state.firstName.trim().length > 0 &&
            this.state.lastName.trim().length > 0 &&
            this.state.username.trim().length > 0 &&
            this.state.password.trim().length > 0 && this.passwordsMatch();
    }

    private passwordsMatch(): boolean {
        return this.state.password === this.state.passwordConfirm;
    }

    private errorRelevant() {
        return this.props.error.origin === ActionType.REGISTER_FAILURE;
    }

    private onRegister = () => {
        const {passwordConfirm, ...userData} = this.state;
        this.props.register(userData);
    };

    private onCancel = () => {
        Routing.transitionTo(Routes.login);
    };

    public render() {
        const i18n = this.props.i18n;
        return <Panel bsStyle='info' className={this.errorRelevant() ? 'register-panel-expanded' : 'register-panel'}>
            <Panel.Heading>
                <Panel.Title componentClass='h3'>{i18n('register.title')}</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
                {this.renderMask()}
                <Form horizontal={true} className='register-form'>
                    {this.renderAlert()}
                    <div className='row'>
                        <div className='col-xs-6'>
                            <HorizontalInput type='text' name='firstName' label={i18n('register.first-name')}
                                             value={this.state.firstName}
                                             labelWidth={4} inputWidth={8} onChange={this.onChange}/>
                        </div>
                        <div className='col-xs-6'>
                            <HorizontalInput type='text' name='lastName' label={i18n('register.last-name')}
                                             value={this.state.lastName}
                                             labelWidth={4} inputWidth={8} onChange={this.onChange}/>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-xs-6'>
                            <HorizontalInput type='text' name='username' label={i18n('register.username')}
                                             value={this.state.username}
                                             labelWidth={4} inputWidth={8} onChange={this.onChange}/>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-xs-6'>
                            <HorizontalInput type='password' name='password' label={i18n('register.password')}
                                             labelWidth={4} inputWidth={8} onChange={this.onChange}
                                             value={this.state.password}/>
                        </div>
                        <div className='col-xs-6'>
                            {this.renderPasswordConfirm()}
                        </div>
                    </div>
                    <ButtonToolbar className='register-buttons'>
                        <Button bsStyle='success' bsSize='small' disabled={!this.isValid() || this.props.loading}
                                onClick={this.onRegister}>{i18n('register.submit')}</Button>
                        <Button bsSize='small' className='register-cancel'
                                onClick={this.onCancel}>{i18n('cancel')}</Button>
                    </ButtonToolbar>
                </Form>
            </Panel.Body>
        </Panel>;
    }

    private renderMask() {
        return this.props.loading ?
            <Mask text={this.props.i18n('login.progress-mask')} classes='mask-container'/> : null;
    }

    private renderAlert() {
        if (!this.errorRelevant()) {
            return null;
        }
        const error = this.props.error;
        const text = error.messageId ? this.props.i18n(error.messageId) : error.message;
        return this.props.error ? <Alert bsStyle='danger' bsSize='small'>
            <div>{text}</div>
        </Alert> : null;
    }

    private renderPasswordConfirm() {
        if (this.passwordsMatch()) {
            return <HorizontalInput type='password' name='passwordConfirm'
                                    label={this.props.i18n('register.password-confirm')}
                                    labelWidth={4} inputWidth={8} onChange={this.onChange}
                                    onKeyPress={this.onKeyPress} value={this.state.passwordConfirm}/>;
        } else {
            return <HorizontalInput type='password' name='passwordConfirm'
                                    label={this.props.i18n('register.password-confirm')}
                                    labelWidth={4} inputWidth={8} onChange={this.onChange}
                                    onKeyPress={this.onKeyPress} value={this.state.passwordConfirm} validation='error'
                                    title={this.props.i18n('register.passwords-not-matching.tooltip')}/>;
        }
    }
}

export default connect((state: TermItState) => {
    return {
        loading: state.loading,
        error: state.error
    };
}, (dispatch: ThunkDispatch<object, undefined, Action>) => {
    return {
        register: (user: { username: string, password: string }) => dispatch(register(user)),
        clearError: () => dispatch(clearError(ActionType.REGISTER_FAILURE))
    }
})(injectIntl(withI18n(Register)));
