import * as React from "react";
import {injectIntl} from "react-intl";
import User, {EMPTY_USER} from "../../model/User";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {connect} from "react-redux";
import {ThunkDispatch} from "../../util/Types";
import {disableUser, enableUser, loadUsers, unlockUser} from "../../action/AsyncUserActions";
import {Card, CardBody, CardHeader, Table} from "reactstrap";
import UserRow from "./UserRow";
import "./Users.scss";
import TermItState from "../../model/TermItState";
import PasswordReset from "./PasswordReset";

interface UsersProps extends HasI18n {
    currentUser: User;
    loadUsers: () => Promise<User[]>;
    disableUser: (user: User) => Promise<any>;
    enableUser: (user: User) => Promise<any>;
    unlockUser: (user: User, newPassword: string) => Promise<any>;
}

interface UsersState {
    users: User[];
    displayUnlock: boolean;
    userToUnlock: User;
}

export class Users extends React.Component<UsersProps, UsersState> {
    constructor(props: UsersProps) {
        super(props);
        this.state = {
            users: [],
            displayUnlock: false,
            userToUnlock: EMPTY_USER
        };
    }

    public componentDidMount(): void {
        this.loadUsers();
    }

    private loadUsers() {
        this.props.loadUsers().then(data => this.setState({users: data}));
    }

    public disableUser = (user: User) => {
        this.props.disableUser(user).then(() => this.loadUsers());
    };

    public enableUser = (user: User) => {
        this.props.enableUser(user).then(() => this.loadUsers());
    };

    public onUnlockUser = (user: User) => {
        this.setState({displayUnlock: true, userToUnlock: user});
    };

    public onCloseUnlock = () => {
        this.setState({displayUnlock: false, userToUnlock: EMPTY_USER});
    };

    public unlockUser = (newPassword: string) => {
        this.props.unlockUser(this.state.userToUnlock, newPassword).then(() => {
            this.onCloseUnlock();
            this.loadUsers();
        });
    };

    public render() {
        const i18n = this.props.i18n;
        const actions = {
            disable: this.disableUser,
            enable: this.enableUser,
            unlock: this.onUnlockUser
        };
        return <Card id="users">
            <CardHeader tag="h4">{i18n("administration.users")}</CardHeader>
            <CardBody>
                <PasswordReset open={this.state.displayUnlock} user={this.state.userToUnlock} onSubmit={this.unlockUser}
                               onCancel={this.onCloseUnlock}/>
                <Table striped={true}>
                    <thead>
                    <tr>
                        <th>&nbsp;</th>
                        <th>{i18n("administration.users.name")}</th>
                        <th>{i18n("administration.users.username")}</th>
                        <th>{i18n("administration.users.status")}</th>
                        <th className="text-center users-row-actions">{i18n("actions")}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.users.map(u => <UserRow key={u.iri} user={u}
                                                        currentUser={u.iri === this.props.currentUser.iri}
                                                        actions={actions}/>)}
                    </tbody>
                </Table>
            </CardBody>
        </Card>;
    }
}

export default connect((state: TermItState) => {
    return {currentUser: state.user};
}, (dispatch: ThunkDispatch) => {
    return {
        loadUsers: () => dispatch(loadUsers()),
        disableUser: (user: User) => dispatch(disableUser(user)),
        enableUser: (user: User) => dispatch(enableUser(user)),
        unlockUser: (user: User, newPassword: string) => dispatch(unlockUser(user, newPassword))
    };
})(injectIntl(withI18n(Users)));
