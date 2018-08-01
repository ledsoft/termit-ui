import * as React from 'react';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {injectIntl} from 'react-intl';

class Login extends React.Component<HasI18n> {

    constructor(props: HasI18n) {
        super(props);
    }


    public render() {
        const i18n = this.props.i18n;
        return <h2>{i18n('login.title')}</h2>
    }
}

export default injectIntl(withI18n(Login));
