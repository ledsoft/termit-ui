import Routes from "./Routes";

export default {
    // Will be replaced with actual server url during build
    SERVER_URL: '__SERVER_URL__',
    APP_NAME: 'TermIt',
    HOME_ROUTE: Routes.dashboard,
    LANGUAGE_COOKIE: 'TermIt-LANG',
    LANG: {
        CS: 'cs',
        EN: 'en'
    },
    // Error origin caused by the inability to connect to the backend server
    CONNECTION_ERROR: 'CONNECTION_ERROR',
    JSON_LD_MIME_TYPE: 'application/ld+json'
}