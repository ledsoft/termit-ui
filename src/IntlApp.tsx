import IntlData from "./model/IntlData";
import * as React from "react";
import {IntlProvider} from "react-intl";
import {Route, Router, Switch} from "react-router-dom";
import Routing from "./util/Routing";
import Routes from "./util/Routes";
import Login from "./component/login/Login";
import Register from "./component/register/Register";
import MainView from "./component/MainView";
import {connect} from "react-redux";
import TermItState from "./model/TermItState";

interface IntlWrapperProps {
    intl: IntlData
}

const IntlWrapper: React.SFC<IntlWrapperProps> = (props) => {
    return <IntlProvider {...props.intl}>
        <Router history={Routing.history}>
            <Switch>
                <Route path={Routes.login.path} component={Login}/>
                <Route path={Routes.register.path} component={Register}/>
                <Route component={MainView}/>
            </Switch>
        </Router>
    </IntlProvider>;
};

export default connect((state: TermItState) => {
    return {intl: state.intl}
})(IntlWrapper);