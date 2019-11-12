import * as React from "react";
import {injectIntl} from "react-intl";
import User from "../../model/User";
import withI18n, {HasI18n} from "../hoc/withI18n";

interface UsersProps extends HasI18n {
    users: User[];
}

export class Users extends React.Component<UsersProps> {
}

export default injectIntl(withI18n(Users));
