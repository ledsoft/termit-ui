import Routes from "./Routes";

const constants = {
    // Will be replaced with actual server url during build
    SERVER_URL: "__SERVER_URL__",
    // Prefix of the server REST API
    API_PREFIX: "/rest",
    APP_NAME: "TermIt",
    // Will be replaced with actual version during build
    VERSION: "__VERSION__",
    // Will be replaced with actual deployment name during build
    DEPLOYMENT_NAME: "__DEPLOYMENT_NAME__",
    HOME_ROUTE: Routes.dashboard,
    LANG: {
        CS: {
            locale: "cs",
            label: "Čestina"
        },
        EN: {
            locale: "en",
            label: "English"
        }
    },
    // Error origin caused by the inability to connect to the backend server
    CONNECTION_ERROR: "CONNECTION_ERROR",
    JSON_LD_MIME_TYPE: "application/ld+json",
    TEXT_MIME_TYPE: "text/plain",
    HTML_MIME_TYPE: "text/html",
    CSV_MIME_TYPE: "text/csv",
    TTL_MIME_TYPE: "text/turtle",
    EXCEL_MIME_TYPE: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    X_WWW_FORM_URLENCODED: "application/x-www-form-urlencoded",
    MULTIPART_FORM_DATA: "multipart/form-data",
    // HTTP response status 401 Unauthorized
    STATUS_UNAUTHORIZED: 401,
    // Axios uses lower case for header names
    Headers: {
        ACCEPT: "accept",
        AUTHORIZATION: "authorization",
        CONTENT_DISPOSITION: "content-disposition",
        CONTENT_TYPE: "content-type",
        IF_MODIFIED_SINCE: "if-modified-since",
        LAST_MODIFIED: "last-modified",
        LOCATION: "location"
    },
    STORAGE_JWT_KEY: "",
    STORAGE_LANG_KEY: "",
    // How many messages should be displayed at one moment
    MESSAGE_DISPLAY_COUNT: 5,
    // For how long should a message be displayed
    MESSAGE_DISPLAY_TIMEOUT: 5000,

    // News
    NEWS_MD_URL: {
        "cs": location.origin + location.pathname + "NEWS.cs.md",
        "en": location.origin + location.pathname + "NEWS.en.md",
    },

    // Layout customization
    LAYOUT_NAVBAR_BACKGROUND_IS_LIGHT: false,
    LAYOUT_NAVBAR_BACKGROUND: "#777",

    // Wallpaper: ~60% color saturation + some blur (~4px radius) + JPEG compression to <150KB.
    // LAYOUT_WALLPAPER: null,
    // LAYOUT_WALLPAPER: "/background/Magnetic_Termite_Mounds.small-blur.jpg",
    // LAYOUT_WALLPAPER_POSITION: "center center", // CSS background-position property
    LAYOUT_WALLPAPER: "background/people-on-the-bridge-with-cityscape-in-prague-czech-republic.small-blur.jpg",
    LAYOUT_WALLPAPER_POSITION: "top center", // CSS background-position property

    // Navbar background when LAYOUT_WALLPAPER is in use
    LAYOUT_WALLPAPER_NAVBAR_BACKGROUND_IS_LIGHT: false,
    LAYOUT_WALLPAPER_NAVBAR_BACKGROUND: "rgba(0,0,0,0.2)",
};

const deployment = constants.DEPLOYMENT_NAME.length > 0 ? constants.DEPLOYMENT_NAME + "-" : "";
constants.STORAGE_JWT_KEY = constants.APP_NAME + "-" + deployment + constants.Headers.AUTHORIZATION;
constants.STORAGE_LANG_KEY = constants.APP_NAME + "-" + deployment + "LANG";

export default constants;
