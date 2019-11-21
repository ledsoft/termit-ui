import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import User from "../../model/User";
import {Button} from "reactstrap";
import Utils from "../../util/Utils";

function resolveStatusName(user: User) {
    if (user.isLocked()) {
        return "administration.users.status.locked";
    } else if (user.isDisabled()) {
        return "administration.users.status.disabled";
    } else {
        return "administration.users.status.active";
    }
}

function renderActionButtons(user: User, i18n: (id: string) => string) {
    const buttons = [];
    if (!user.isDisabled()) {
        const btnId = `user-${Utils.hashCode(user.iri)}-disable`;
        buttons.push(<Button id={btnId} key={btnId} size="sm"
                             title={i18n("administration.users.status.action.disable.tooltip")}
                             color="primary">{i18n("administration.users.status.action.disable")}</Button>);
    }
    if (user.isDisabled()) {
        const btnId = `user-${Utils.hashCode(user.iri)}-enable`;
        buttons.push(<Button id={btnId} key={btnId} size="sm"
                             title={i18n("administration.users.status.action.enable.tooltip")}
                             color="primary">{i18n("administration.users.status.action.enable")}</Button>);
    }
    return buttons;
}

interface UserRowProps extends HasI18n {
    user: User;
}

export const UserRow: React.FC<UserRowProps> = (props: UserRowProps) => {
    return <tr>
        <td className="align-middle">{props.user.fullName}</td>
        <td className="align-middle">{props.user.username}</td>
        <td className="align-middle">{props.i18n(resolveStatusName(props.user))}</td>
        <td className="align-middle">{renderActionButtons(props.user, props.i18n)}</td>
    </tr>;
};

export default injectIntl(withI18n(UserRow));
