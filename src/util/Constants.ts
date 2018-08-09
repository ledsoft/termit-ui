import Routes from "./Routes";

const constants =  {
    // Will be replaced with actual server url during build
    SERVER_URL: '__SERVER_URL__',
    // Prefix of the server REST API
    API_PREFIX: '/rest',
    APP_NAME: 'TermIt',
    // Will be replaced with actual version during build
    VERSION: '__VERSION__',
    HOME_ROUTE: Routes.dashboard,
    LANGUAGE_COOKIE: 'TermIt-LANG',
    LANG: {
        CS: 'cs',
        EN: 'en'
    },
    // Error origin caused by the inability to connect to the backend server
    CONNECTION_ERROR: 'CONNECTION_ERROR',
    JSON_LD_MIME_TYPE: 'application/ld+json',
    AUTHENTICATION_HEADER: 'Authentication',
    STORAGE_JWT_KEY: ''
};

constants.STORAGE_JWT_KEY = constants.APP_NAME + '-' + constants.AUTHENTICATION_HEADER;

export default constants;