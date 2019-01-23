import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import "./index.scss";
import registerServiceWorker from "./registerServiceWorker";
import * as en from "react-intl/locale-data/en";
import * as cs from "react-intl/locale-data/cs";
import {addLocaleData} from "react-intl";
import TimeAgo from "javascript-time-ago";
// @ts-ignore
import timeagoEn from "javascript-time-ago/locale/en";
// @ts-ignore
import tiemagoCs from "javascript-time-ago/locale/cs";

// Load react-intl locales
addLocaleData([...en, ...cs]);

// Load locales for the TimeAgo library
TimeAgo.addLocale(timeagoEn);
TimeAgo.addLocale(tiemagoCs);


ReactDOM.render(<App/>, document.getElementById("root") as HTMLElement);

registerServiceWorker();
