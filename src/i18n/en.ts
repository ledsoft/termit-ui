import Constants from '../util/Constants';

export default {
    locale: Constants.LANG.EN,

    messages: {
        'please-wait': 'Please wait...',
        'connection.error': 'Unable to connect to the server.',
        'ajax.unparseable-error': 'Action failed. Server responded with unexpected error. If necessary, see browser log for more details.',
        'footer.copyright': 'KBSS at FEE CTU in Prague',

        'login.title': Constants.APP_NAME + ' - Log in',
        'login.username': 'Username',
        'login.password': 'Password',
        'login.submit': 'Login',
        'login.register': 'Register',
        'login.error': 'Authentication failed.',
        'login.progress-mask': 'Logging in...',
        'login.locked': 'Account locked.',
        'login.disabled': 'Account disabled.',

        'register.title': Constants.APP_NAME + ' - Registration',
        'register.first-name': 'First name',
        'register.last-name': 'Last name',
        'register.username': 'Username',
        'register.password': 'Password',
        'register.password-confirm': 'Confirm password',
        'register.passwords-not-matching-tooltip': 'Passwords don\'t match.',
        'register.submit': 'Register',
        'register.mask': 'Registering...',
        'register.error': 'Unable to register user account.',
        'register.login.error': 'Unable to login into the newly created account.',

        'main.dashboard.nav': 'Dashboard',
        'main.statistics.nav': 'Statistics',
        'main.admin.nav': 'Administration',
        'main.user-profile': 'User profile',
        'main.logout': 'Log out',
        'main.search.placeholder': 'Search',
        'main.search.tooltip': 'Search in all vocabularies and terms',
    }
}