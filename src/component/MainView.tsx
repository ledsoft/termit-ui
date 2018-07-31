import * as React from 'react';
import {injectIntl} from 'react-intl';
import addI18n, {HasI18n} from "./hoc/addI18n";
import withLoading from "./hoc/withLoading";

class MainView extends React.Component<HasI18n> {

    public render() {
        return <h1>"Hello, world!</h1>;
    }
}

export default injectIntl(addI18n(withLoading(MainView)));