import * as React from 'react';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {injectIntl} from 'react-intl';
import {Alert, Button, Form, FormControl, FormControlProps, Panel} from 'react-bootstrap';
import Input from '../misc/HorizontalInput';
import Routing from '../../util/Routing';
import './Login.scss';
import Routes from "../../util/Routes";
import Mask from "../misc/Mask";
import {connect} from 'react-redux';
import TermItState from "../../model/TermItState";
import {login} from "../../action/ComplexActions";
import {Action} from "redux";
import {ThunkDispatch} from "redux-thunk";
import ErrorInfo from "../../model/ErrorInfo";
import ActionType from "../../action/ActionType";
import {clearError} from "../../action/SyncActions";

interface LoginProps extends HasI18n {
    loading: boolean,
    error: ErrorInfo,
    login: (username: string, password: string) => void
    clearError: () => void
}

interface LoginState {
    username: string,
    password: string
}

export class Login extends React.Component<LoginProps, LoginState> {

    constructor(props: LoginProps) {
        super(props);
        this.state = {
            username: '',
            password: ''
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
            this.login();
        }
    };

    private login = () => {
        this.props.login(this.state.username, this.state.password);
    };

    private register = () => {
        Routing.transitionTo(Routes.register);
    };

    private errorRelevant() {
        return this.props.error.origin === ActionType.LOGIN_FAILURE;
    }

    private isValid() {
        return this.state.username.length > 0 && this.state.password.length > 0;
    }

    public render() {
        const i18n = this.props.i18n;
        const panelCls = this.errorRelevant() ? 'login-panel expanded' : 'login-panel';
        return <Panel bsStyle='info' className={panelCls}>
            <Panel.Heading>
                <Panel.Title componentClass='h3'>{i18n('login.title')}</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
                {this.renderMask()}
                <Form horizontal={true}>
                    {this.renderAlert()}
                    <Input name='username' label={i18n('login.username')} value={this.state.username}
                           onKeyPress={this.onKeyPress} onChange={this.onChange}
                           labelWidth={3} inputWidth={9}/>
                    <Input type='password' name='password' label={i18n('login.password')} value={this.state.password}
                           onKeyPress={this.onKeyPress} onChange={this.onChange}
                           labelWidth={3} inputWidth={9}/>

                    <div className='col-xs-3'>&nbsp;</div>
                    <div className='col-xs-9 buttons'>
                        <Button bsStyle='success' bsSize='small' onClick={this.login}
                                disabled={this.props.loading || !this.isValid()}>{i18n('login.submit')}</Button>
                        <Button bsStyle='link' bsSize='small' onClick={this.register} className='register-link'
                                disabled={this.props.loading}>{i18n('login.register')}</Button>
                    </div>
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
        const messageId = error.messageId ? error.messageId : 'login.error';
        return this.props.error ? <Alert bsStyle='danger' bsSize='small'>
            <div>{this.props.i18n(messageId)}</div>
        </Alert> : null;
    }
}

export default connect((state: TermItState) => {
    return {
        loading: state.loading,
        error: state.error
    };
}, (dispatch: ThunkDispatch<object, undefined, Action>) => {
    return {
        login: (username: string, password: string) => dispatch(login(username, password)),
        clearError: () => dispatch(clearError(ActionType.LOGIN_FAILURE))
    };
})(injectIntl(withI18n(Login)));
