import * as React from "react";
import {injectIntl} from "react-intl";
import classNames from "classnames";
import withI18n, {HasI18n} from "../hoc/withI18n";
import User from "../../model/User";
import {Button} from "reactstrap";
import Utils from "../../util/Utils";
import {GoCheck, GoCircleSlash, GoIssueOpened} from "react-icons/go";
import InfoIcon from "../misc/InfoIcon";

const STATUS_MAP = {
    ACTIVE: {
        buttonTitle: "administration.users.status.action.disable.tooltip",
        buttonLabel: "administration.users.status.action.disable",
        statusLabel: "administration.users.status.active",
        help: "administration.users.status.active.help",
        icon: GoCheck
    },
    DISABLED: {
        buttonTitle: "administration.users.status.action.enable.tooltip",
        buttonLabel: "administration.users.status.action.enable",
        statusLabel: "administration.users.status.disabled",
        help: "administration.users.status.disabled.help",
        icon: GoCircleSlash
    },
    LOCKED: {
        buttonTitle: "administration.users.status.action.unlock.tooltip",
        buttonLabel: "administration.users.status.action.unlock",
        statusLabel: "administration.users.status.locked",
        help: "administration.users.status.locked.help",
        icon: GoIssueOpened
    }
};

function resolveStatus(user: User) {
    if (user.isLocked()) {
        return STATUS_MAP.LOCKED;
    } else if (user.isDisabled()) {
        return STATUS_MAP.DISABLED;
    } else {
        return STATUS_MAP.ACTIVE;
    }
}

function renderActionButtons(user: User, actions: UserActions, i18n: (id: string) => string) {
    const buttons = [];
    if (user.isDisabled()) {
        const btnId = `user-${Utils.hashCode(user.iri)}-enable`;
        buttons.push(<Button id={btnId} key={btnId} size="sm" onClick={() => actions.enable(user)}
                             title={i18n(STATUS_MAP.DISABLED.buttonTitle)} className="users-action-button"
                             color="primary">{i18n(STATUS_MAP.DISABLED.buttonLabel)}</Button>);
    } else {
        const btnId = `user-${Utils.hashCode(user.iri)}-disable`;
        buttons.push(<Button id={btnId} key={btnId} size="sm" onClick={() => actions.disable(user)}
                             title={i18n(STATUS_MAP.ACTIVE.buttonTitle)} className="users-action-button"
                             color="warning">{i18n(STATUS_MAP.ACTIVE.buttonLabel)}</Button>);
    }
    if (user.isLocked()) {
        const btnId = `user-${Utils.hashCode(user.iri)}-unlock`;
        buttons.push(<Button id={btnId} key={btnId} size="sm" onClick={() => actions.unlock(user)}
                             title={i18n(STATUS_MAP.LOCKED.buttonTitle)} className="users-action-button"
                             color="primary">{i18n(STATUS_MAP.LOCKED.buttonLabel)}</Button>);
    }
    return buttons;
}

export interface UserActions {
    disable: (user: User) => void;
    enable: (user: User) => void;
    unlock: (user: User) => void;
}

interface UserRowProps extends HasI18n {
    user: User;
    currentUser?: boolean;   // Whether this row represents the currently logged in user
    actions: UserActions;
}

export const UserRow: React.FC<UserRowProps> = (props: UserRowProps) => {
    const user = props.user;
    const status = resolveStatus(user);
    return <tr className={classNames({"italics": !user.isActive()})}>
        <td className="align-middle"
            title={props.i18n(status.statusLabel)}>{React.createElement(status.icon)}
        </td>
        <td className="align-middle">{user.fullName}</td>
        <td className="align-middle">{user.username}</td>
        <td className="align-middle m-user-status">
            {props.i18n(status.statusLabel)}
            <InfoIcon id={`user-${Utils.hashCode(user.iri)}-status-info`} text={props.i18n(status.help)}/>
        </td>
        <td className="align-middle users-row-actions">{props.currentUser ? null : renderActionButtons(user, props.actions, props.i18n)}</td>
    </tr>;
};

UserRow.defaultProps = {
    currentUser: false
};

export default injectIntl(withI18n(UserRow));
