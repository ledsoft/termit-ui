import * as React from "react";
import {injectIntl} from "react-intl";
import User from "../../model/User";

interface UsersProps {
    users: User[];
}

export class Users extends React.Component<UsersProps> {

    public componentDidMount(): void {

    }
}
