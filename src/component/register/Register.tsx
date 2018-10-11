import * as React from 'react';
import {injectIntl} from 'react-intl';
import {Alert, Button, ButtonToolbar, Card, CardBody, CardHeader, Col, Form, Row} from 'reactstrap';
import withI18n, {HasI18n} from '../hoc/withI18n';
import ErrorInfo from '../../model/ErrorInfo';
import HorizontalInput from '../misc/HorizontalInput';
import './Register.scss';
import Routes from '../../util/Routes';
import Routing from '../../util/Routing';
import Mask from '../misc/Mask';
import {connect} from 'react-redux';
import TermItState from '../../model/TermItState';
import {clearError} from '../../action/SyncActions';
import ActionType from '../../action/ActionType';
import {register} from '../../action/ComplexActions';
import Footer from '../Footer';
import Ajax, {params} from "../../util/Ajax";
import Constants from '../../util/Constants';
import {ThunkDispatch} from "../../util/Types";
import Authentication from "../../util/Authentication";

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
    passwordConfirm: string,
    usernameExists: boolean
}

export class Register extends React.Component<RegisterProps, RegisterState> {
    constructor(props: RegisterProps) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            username: '',
            password: '',
            passwordConfirm: '',
            usernameExists: false
        };
    }

    public componentDidMount() {
        // Clear potentially pre-existing JWT, which would cause issues with username existence check
        Authentication.clearToken();
    }

    private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (this.errorRelevant()) {
            this.props.clearError();
        }
        const newState = Object.assign({}, this.state);
        newState[e.currentTarget.name!] = e.currentTarget.value;
        this.setState(newState);
    };

    private onUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.onChange(e);
        const username = e.currentTarget.value;
        Ajax.get(Constants.API_PREFIX + '/users/username', params({username})).then(data => {
            this.setState({usernameExists: data === true});
        });
    };

    private onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && this.isValid()) {
            this.onRegister();
        }
    };

    private isValid(): boolean {
        return this.state.firstName.trim().length > 0 &&
            this.state.lastName.trim().length > 0 &&
            this.state.username.trim().length > 0 &&
            this.state.password.trim().length > 0 && this.passwordsMatch() && !this.state.usernameExists;
    }

    private passwordsMatch(): boolean {
        return this.state.password === this.state.passwordConfirm;
    }

    private errorRelevant() {
        return this.props.error.origin === ActionType.REGISTER;
    }

    private onRegister = () => {
        const {passwordConfirm, usernameExists, ...userData} = this.state;
        this.props.register(userData);
    };

    private onCancel = () => {
        if (this.errorRelevant()) {
            this.props.clearError();
        }
        Routing.transitionTo(Routes.login);
    };

    public render() {
        const i18n = this.props.i18n;
        return <div className='app-container'>
            <Card className='register-panel'>
                <CardHeader color='info'>
                    <h5>{i18n('register.title')}</h5>
                </CardHeader>
                <CardBody>
                    {this.renderMask()}
                    <Form className='register-form'>
                        {this.renderAlert()}
                        <Row>
                            <Col md={6}>
                                <HorizontalInput type='text' name='firstName' label={i18n('register.first-name')}
                                                 value={this.state.firstName}
                                                 labelWidth={4} inputWidth={8} onChange={this.onChange}/>
                            </Col>
                            <Col md={6}>
                                <HorizontalInput type='text' name='lastName' label={i18n('register.last-name')}
                                                 value={this.state.lastName}
                                                 labelWidth={4} inputWidth={8} onChange={this.onChange}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                {this.renderUsername()}
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <HorizontalInput type='password' name='password' label={i18n('register.password')}
                                                 labelWidth={4} inputWidth={8} onChange={this.onChange}
                                                 value={this.state.password}/>
                            </Col>
                            <Col md={6}>
                                {this.renderPasswordConfirm()}
                            </Col>
                        </Row>
                        <ButtonToolbar className='register-buttons'>
                            <Button color='success' size='sm' disabled={!this.isValid() || this.props.loading}
                                    onClick={this.onRegister}>{i18n('register.submit')}</Button>
                            <Button size='sm' className='register-cancel'
                                    onClick={this.onCancel}>{i18n('cancel')}</Button>
                        </ButtonToolbar>
                    </Form>
                </CardBody>
            </Card>
            <Footer className='footer-login'/>
        </div>;
    }

    private renderMask() {
        return this.props.loading ?
            <Mask text={this.props.i18n('register.mask')} classes='mask-container'/> : null;
    }

    private renderAlert() {
        if (!this.errorRelevant()) {
            return null;
        }
        const error = this.props.error;
        const text = error.messageId ? this.props.i18n(error.messageId) : error.message;
        return this.props.error ? <Alert color='danger'>{text}</Alert> : null;
    }

    private renderUsername() {
        if (!this.state.usernameExists) {
            return <HorizontalInput type='text' name='username' label={this.props.i18n('register.username')}
                                    value={this.state.username}
                                    labelWidth={4} inputWidth={8} onChange={this.onUsernameChange}/>
        } else {
            return <HorizontalInput type='text' name='username' label={this.props.i18n('register.username')}
                                    value={this.state.username} invalid={true}
                                    invalidMessage={this.props.i18n('register.username-exists.tooltip')}
                                    title={this.props.i18n('register.username-exists.tooltip')}
                                    labelWidth={4} inputWidth={8} onChange={this.onUsernameChange}/>;
        }
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
                                    onKeyPress={this.onKeyPress} value={this.state.passwordConfirm} invalid={true}
                                    invalidMessage={this.props.i18n('register.passwords-not-matching.tooltip')}
                                    title={this.props.i18n('register.passwords-not-matching.tooltip')}/>;
        }
    }
}

export default connect((state: TermItState) => {
    return {
        loading: state.loading,
        error: state.error
    };
}, (dispatch: ThunkDispatch) => {
    return {
        register: (user: { username: string, password: string }) => dispatch(register(user)),
        clearError: () => dispatch(clearError(ActionType.REGISTER))
    }
})(injectIntl(withI18n(Register)));
