import * as React from "react";
import {injectIntl} from "react-intl";
import User from "../../model/User";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {connect} from "react-redux";
import {ThunkDispatch} from "../../util/Types";
import {disableUser, enableUser, loadUsers} from "../../action/AsyncUserActions";
import {Card, CardBody, CardHeader, Table} from "reactstrap";
import UserRow from "./UserRow";
import "./Users.scss";
import TermItState from "../../model/TermItState";

interface UsersProps extends HasI18n {
    currentUser: User;
    loadUsers: () => Promise<User[]>;
    disableUser: (user: User) => Promise<any>;
    enableUser: (user: User) => Promise<any>;
}

export class Users extends React.Component<UsersProps, { users: User[] }> {
    constructor(props: UsersProps) {
        super(props);
        this.state = {users: []};
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

    public render() {
        const i18n = this.props.i18n;
        const actions = {
            disable: this.disableUser,
            enable: this.enableUser
        };
        return <Card id="users">
            <CardHeader tag="h4">{i18n("administration.users")}</CardHeader>
            <CardBody>
                <Table striped={true} responsive={true}>
                    <thead>
                    <tr>
                        <th>&nbsp;</th>
                        <th>{i18n("administration.users.name")}</th>
                        <th>{i18n("administration.users.username")}</th>
                        <th>{i18n("administration.users.status")}</th>
                        <th className="text-center">{i18n("actions")}</th>
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
        enableUser: (user: User) => dispatch(enableUser(user))
    };
})(injectIntl(withI18n(Users)));
