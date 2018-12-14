import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.scss';
import registerServiceWorker from './registerServiceWorker';
import * as en from 'react-intl/locale-data/en';
import * as cs from 'react-intl/locale-data/cs';
import {addLocaleData} from 'react-intl';

// Load react-intl locales
addLocaleData([...en, ...cs]);


ReactDOM.render(<App/>, document.getElementById('root') as HTMLElement);

registerServiceWorker();
