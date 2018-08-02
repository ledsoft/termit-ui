import * as React from 'react';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {injectIntl} from 'react-intl';
import {Alert, Button, Form, FormControl, Panel} from 'react-bootstrap';
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

interface LoginProps extends HasI18n {
    loading: boolean,
    error: ErrorInfo,
    login: (username: string, password: string) => void
}

export class Login extends React.Component<LoginProps> {

    constructor(props: LoginProps) {
        super(props);
    }

    private onKeyPress = (e: React.KeyboardEvent<FormControl>) => {
        if (e.key === 'Enter') {
            this.login();
        }
    };

    private login = () => {
        const username = '';    // TODO
        const password = '';
        this.props.login(username, password);
    };

    private register = () => {
        Routing.transitionTo(Routes.register);
    };

    private errorRelevant() {
        return this.props.error.origin === ActionType.LOGIN_FAILURE;
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
                    <Input name='username' label={i18n('login.username')}
                           labelWidth={3} onKeyPress={this.onKeyPress}
                           inputWidth={9}/>
                    <Input type='password' name='password' label={i18n('login.password')} labelWidth={3}
                           onKeyPress={this.onKeyPress}
                           inputWidth={9}/>

                    <div className='col-xs-3'>&nbsp;</div>
                    <div className='col-xs-9' style={{padding: '0 0 0 7px'}}>
                        <Button bsStyle='success' bsSize='small' onClick={this.login}
                                disabled={this.props.loading}>{i18n('login.submit')}</Button>
                        <Button bsStyle='link' bsSize='small' onClick={this.register} style={{padding: '0 0 0 15px'}}
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
        login: (username: string, password: string) => dispatch(login(username, password))
    };
})(injectIntl(withI18n(Login)));
