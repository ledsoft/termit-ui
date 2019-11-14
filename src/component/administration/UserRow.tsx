import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import User from "../../model/User";

function resolveStatusName(user: User) {
    if (user.isLocked()) {
        return "administration.users.status.locked";
    } else if (user.isDisabled()) {
        return "administration.users.status.disabled";
    } else {
        return "administration.users.status.active";
    }
}

interface UserRowProps extends HasI18n {
    user: User;
}

const UserRow: React.FC<UserRowProps> = (props: UserRowProps) => {
    return <tr>
        <td>{props.user.fullName}</td>
        <td>{props.user.username}</td>
        <td>{props.i18n(resolveStatusName(props.user))}</td>
        <td>&nbsp;</td>
    </tr>;
};

export default injectIntl(withI18n(UserRow));
