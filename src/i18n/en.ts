import Constants from '../util/Constants';

export default {
    locale: Constants.LANG.EN,

    messages: {
        'please-wait': 'Please wait...',
        'connection.error': 'Unable to connect to the server.',

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
        'register.passwords-not-matching-tooltip': 'Passwords don\'t match',
        'register.submit': 'Register',
        'register.mask': 'Registering...',
        'register.error': 'Unable to register user account.',
        'register.login.error': 'Unable to login into the newly created account.',
    }
}