import * as React from 'react';
import {IntlProvider} from 'react-intl';
import {Provider} from 'react-redux';
import {Route, Router, Switch} from 'react-router-dom';
import './App.css';
import TermItStore from './store/TermItStore';
import Routes from "./util/Routes";
import Routing from './util/Routing';
import MainView from "./component/MainView";
import I18nStore from './store/I18nStore';

let intlData: { messages: {}, locale: string };

function selectLocalization() {
    const lang: string = navigator.language;
    if (lang && lang === 'cs' || lang === 'cs-CZ' || lang === 'sk' || lang === 'sk-SK') {
        intlData = require('./i18n/cs').default;
    } else {
        intlData = require('./i18n/en').default;
    }
    I18nStore.messages = intlData.messages;
}

selectLocalization();

const App: React.SFC = (props) => {
    return <IntlProvider {...intlData}>
        <Provider store={TermItStore}>
            <Router history={Routing.history}>
                <Switch>
                    <Route path={Routes.dashboard.path} compoment={MainView}/>
                </Switch>
            </Router>
        </Provider>
    </IntlProvider>;
};

export default App;
