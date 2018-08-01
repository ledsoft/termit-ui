import * as React from 'react';
import {injectIntl} from 'react-intl';
import addI18n, {HasI18n} from "./hoc/addI18n";
import withLoading from "./hoc/withLoading";
import {connect} from "react-redux";
import TermItState from "../model/TermItState";

class MainView extends React.Component<HasI18n> {

    constructor(props: HasI18n) {
        super(props);
    }

    public render() {
        return <h1>Hello, world!</h1>;
    }
}

export default connect((state: TermItState) => {
    return {
        loading: state.loading
    };
})(injectIntl(addI18n(withLoading(MainView))));