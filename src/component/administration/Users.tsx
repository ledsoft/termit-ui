import * as React from "react";
import {useEffect, useState} from "react";
import {injectIntl} from "react-intl";
import User from "../../model/User";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {connect} from "react-redux";
import {ThunkDispatch} from "../../util/Types";
import {loadUsers} from "../../action/AsyncUserActions";
import {Card, CardBody, CardHeader, Table} from "reactstrap";
import UserRow from "./UserRow";

interface UsersProps extends HasI18n {
    loadUsers: () => Promise<User[]>;
}

/**
 * First attempt at using React Hooks with a component.
 */
export const Users: React.FC<UsersProps> = props => {
    const [users, setUsers] = useState<User[]>([]);
    useEffect(() => {
        props.loadUsers().then(data => setUsers(data));
    }, []);

    return <Card id="users">
        <CardHeader tag="h4">{props.i18n("administration.users")}</CardHeader>
        <CardBody>
            <Table striped={true} responsive={true}>
                <thead>
                <tr>
                    <th>{props.i18n("administration.users.name")}</th>
                    <th>{props.i18n("administration.users.username")}</th>
                    <th>{props.i18n("administration.users.status")}</th>
                    <th className="text-center">{props.i18n("actions")}</th>
                </tr>
                </thead>
                <tbody>
                {users.map(u => <UserRow key={u.iri} user={u}/>)}
                </tbody>
            </Table>
        </CardBody>
    </Card>;
};

export default connect(undefined, (dispatch: ThunkDispatch) => {
    return {
        loadUsers: () => dispatch(loadUsers())
    };
})(injectIntl(withI18n(Users)));
