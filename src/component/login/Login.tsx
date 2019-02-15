import * as React from "react";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {injectIntl} from "react-intl";
import {Alert, Button, ButtonToolbar, Card, CardBody, CardHeader, Col, Form, Row} from "reactstrap";
import HorizontalInput from "../misc/HorizontalInput";
import Routing from "../../util/Routing";
import Routes from "../../util/Routes";
import Mask from "../misc/Mask";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {login} from "../../action/AsyncActions";
import ErrorInfo from "../../model/ErrorInfo";
import {ThunkDispatch} from "../../util/Types";
import PublicLayout from "../layout/PublicLayout";
import {AsyncFailureAction, MessageAction} from "../../action/ActionType";
import AsyncActionStatus from "../../action/AsyncActionStatus";

interface LoginProps extends HasI18n {
    loading: boolean;
    login: (username: string, password: string) => Promise<MessageAction | AsyncFailureAction>;
}

interface LoginState {
    username: string;
    password: string;
    error: ErrorInfo | null;
}

export class Login extends React.Component<LoginProps, LoginState> {

    constructor(props: LoginProps) {
        super(props);
        this.state = {
            username: "",
            password: "",
            error: null
        };
    }

    private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newState = Object.assign({}, this.state, {error: null});
        newState[e.currentTarget.name!] = e.currentTarget.value;
        this.setState(newState);
    };

    private onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && this.isValid()) {
            this.login();
        }
    };

    private login = () => {
        this.props.login(this.state.username, this.state.password).then(result => {
            const asyncResult = result as AsyncFailureAction;
            if (asyncResult.status === AsyncActionStatus.FAILURE) {
                this.setState({error: asyncResult.error});
            }
        });
    };

    private register = () => {
        Routing.transitionTo(Routes.register);
    };

    private isValid() {
        return this.state.username.length > 0 && this.state.password.length > 0;
    }

    public render() {
        const i18n = this.props.i18n;
        return <PublicLayout title={i18n("login.title")}>
            <Card className="modal-panel">
                <CardHeader color="info">
                    <h5>{i18n("login.title")}</h5>
                </CardHeader>
                <CardBody>
                    {this.renderMask()}
                    <Form>
                        {this.renderAlert()}
                        <HorizontalInput name="username" label={i18n("login.username")} value={this.state.username}
                                         onKeyPress={this.onKeyPress} onChange={this.onChange} autoFocus={true}
                                         labelWidth={4} inputWidth={8}/>
                        <HorizontalInput type="password" name="password" label={i18n("login.password")}
                                         value={this.state.password}
                                         onKeyPress={this.onKeyPress} onChange={this.onChange}
                                         labelWidth={4} inputWidth={8}/>

                        <Row>
                            <Col xs={{size: "auto", offset: 4}}>
                                <ButtonToolbar>
                                    <Button id="login-submit" color="success" onClick={this.login}
                                            disabled={this.props.loading || !this.isValid()}>{i18n("login.submit")}</Button>
                                    <Button id="login-register" color="link" onClick={this.register}
                                            className="register-link"
                                            disabled={this.props.loading}>{i18n("login.register")}</Button>
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
            <Mask text={this.props.i18n("login.progress-mask")} classes="mask-container"/> : null;
    }

    private renderAlert() {
        if (!this.state.error) {
            return null;
        }
        const error = this.state.error;
        const messageId = error.messageId ? error.messageId : "login.error";
        return <Alert color="danger">{this.props.i18n(messageId)}</Alert>;
    }
}

export default connect((state: TermItState) => {
    return {
        loading: state.loading
    };
}, (dispatch: ThunkDispatch) => {
    return {
        login: (username: string, password: string) => dispatch(login(username, password))
    };
})(injectIntl(withI18n(Login)));
