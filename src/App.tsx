import * as React from 'react';
import {Provider} from 'react-redux';
import TermItStore from './store/TermItStore';
import IntlApp from "./IntlApp";

const App: React.SFC = () => {
    return <div className='app-container container-fluid'>
        <Provider store={TermItStore}>
            <IntlApp/>
        </Provider>
    </div>;
};

export default App;
