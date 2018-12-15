import * as React from 'react';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {injectIntl} from 'react-intl';
import {Alert, Button, ButtonToolbar, Card, CardBody, CardHeader, Col, Form, Row} from 'reactstrap';
import HorizontalInput from '../misc/HorizontalInput';
import Routing from '../../util/Routing';
import Routes from "../../util/Routes";
import Mask from "../misc/Mask";
import {connect} from 'react-redux';
import TermItState from "../../model/TermItState";
import {login} from "../../action/AsyncActions";
import ErrorInfo from "../../model/ErrorInfo";
import ActionType from "../../action/ActionType";
import {clearError} from "../../action/SyncActions";
import {ThunkDispatch} from "../../util/Types";
import PublicLayout from "../layout/PublicLayout";

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

    private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (this.errorRelevant()) {
            this.props.clearError();
        }
        const newState = Object.assign({}, this.state);
        newState[e.currentTarget.name!] = e.currentTarget.value;
        this.setState(newState);
    };

    private onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
        return this.props.error.origin === ActionType.LOGIN;
    }

    private isValid() {
        return this.state.username.length > 0 && this.state.password.length > 0;
    }

    public render() {
        const i18n = this.props.i18n;
        return <PublicLayout title={i18n('login.title')}>
            <Card className="modal-panel">
                <CardHeader color='info'>
                    <h5>{i18n('login.title')}</h5>
                </CardHeader>
                <CardBody>
                    {this.renderMask()}
                    <Form>
                        {this.renderAlert()}
                        <HorizontalInput name='username' label={i18n('login.username')} value={this.state.username}
                                         onKeyPress={this.onKeyPress} onChange={this.onChange} autoFocus={true}
                                         labelWidth={4} inputWidth={8}/>
                        <HorizontalInput type='password' name='password' label={i18n('login.password')}
                                         value={this.state.password}
                                         onKeyPress={this.onKeyPress} onChange={this.onChange}
                                         labelWidth={4} inputWidth={8}/>

                        <Row>
                            <Col xs={{size: 'auto', offset: 4}}>
                                <ButtonToolbar>
                                    <Button color="success" onClick={this.login}
                                            disabled={this.props.loading || !this.isValid()}>{i18n('login.submit')}</Button>
                                    <Button color="link" onClick={this.register} className="register-link"
                                            disabled={this.props.loading}>{i18n('login.register')}</Button>
                                </ButtonToolbar>
                            </Col>
                        </Row>
                    </Form>
                </CardBody>
            </Card>
        </PublicLayout>;
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
        return this.props.error ? <Alert color='danger'>{this.props.i18n(messageId)}</Alert> : null;
    }
}

export default connect((state: TermItState) => {
    return {
        loading: state.loading,
        error: state.error
    };
}, (dispatch: ThunkDispatch) => {
    return {
        login: (username: string, password: string) => dispatch(login(username, password)),
        clearError: () => dispatch(clearError(ActionType.LOGIN))
    };
})(injectIntl(withI18n(Login)));
