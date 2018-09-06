import Routes from "./Routes";

const constants = {
    // Will be replaced with actual server url during build
    SERVER_URL: '__SERVER_URL__',
    // Prefix of the server REST API
    API_PREFIX: '/rest',
    APP_NAME: 'TermIt',
    // Will be replaced with actual version during build
    VERSION: '__VERSION__',
    HOME_ROUTE: Routes.dashboard,
    LANG: {
        CS: 'cs',
        EN: 'en'
    },
    // Error origin caused by the inability to connect to the backend server
    CONNECTION_ERROR: 'CONNECTION_ERROR',
    JSON_LD_MIME_TYPE: 'application/ld+json',
    // Axios uses lower case for header names
    AUTHENTICATION_HEADER: 'authentication',
    LOCATION_HEADER: 'location',
    STORAGE_JWT_KEY: '',
    STORAGE_LANG_KEY: '',
    // How many messages should be displayed at one moment
    MESSAGE_DISPLAY_COUNT: 5,
    // For how long should a message be displayed
    MESSAGE_DISPLAY_TIMEOUT: 5000
};

constants.STORAGE_JWT_KEY = constants.APP_NAME + '-' + constants.AUTHENTICATION_HEADER;
constants.STORAGE_LANG_KEY = constants.APP_NAME + '-LANG';

export default constants;