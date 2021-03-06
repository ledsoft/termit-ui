import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import "./index.scss";
import registerServiceWorker from "./registerServiceWorker";
import TimeAgo from "javascript-time-ago";
// @ts-ignore
import timeagoEn from "javascript-time-ago/locale/en";
// @ts-ignore
import tiemagoCs from "javascript-time-ago/locale/cs";

// @ts-ignore
if (!Intl.PluralRules) {
    // @ts-ignore
    import("@formatjs/intl-pluralrules/polyfill");
    // @ts-ignore
    import("@formatjs/intl-pluralrules/dist/locale-data/en"); // Add locale data for en
    // @ts-ignore
    import("@formatjs/intl-pluralrules/dist/locale-data/cs"); // Add locale data for cs
}

// @ts-ignore
if (!Intl.RelativeTimeFormat) {
    // @ts-ignore
    import("@formatjs/intl-relativetimeformat/polyfill");
    // @ts-ignore
    import("@formatjs/intl-relativetimeformat/dist/locale-data/en"); // Add locale data for en
    // @ts-ignore
    import("@formatjs/intl-relativetimeformat/dist/locale-data/cs"); // Add locale data for xs
}

// Load locales for the TimeAgo library
TimeAgo.addLocale(timeagoEn);
TimeAgo.addLocale(tiemagoCs);


ReactDOM.render(<App/>, document.getElementById("root") as HTMLElement);

registerServiceWorker();
