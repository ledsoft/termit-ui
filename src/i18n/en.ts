import Constants from '../util/Constants';

export default {
    locale: Constants.LANG.EN,

    messages: {
        'please-wait': 'Please wait...',
        'cancel': 'Cancel',

        'connection.error': 'Unable to connect to the server.',
        'ajax.unparseable-error': 'Action failed. Server responded with unexpected error. If necessary, see browser log for more details.',

        'footer.copyright': 'KBSS at FEE CTU in Prague',
        'footer.version': 'Version {version}',

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
        'register.passwords-not-matching.tooltip': 'Passwords don\'t match.',
        'register.submit': 'Register',
        'register.mask': 'Registering...',
        'register.error': 'Unable to register user account.',
        'register.login.error': 'Unable to login into the newly created account.',
        'register.username-exists.tooltip': 'Username already exists',

        'main.nav.dashboard': 'Dashboard',
        'main.nav.vocabularies': 'Vocabularies',
        'main.nav.statistics': 'Statistics',
        'main.nav.admin': 'Administration',
        'main.user-profile': 'User profile',
        'main.logout': 'Log out',
        'main.search.placeholder': 'Search',
        'main.search.tooltip': 'Search in all vocabularies and terms',

        'dashboard.vocabulary.tile': 'Vocabulary Management',
        'dashboard.document.tile': 'Document Management',
        'dashboard.statistics.tile': 'Statistics',
        'dashboard.create-vocabulary.tile' : 'Create Vocabulary',
        'dashboard.add-document.tile' : 'Add Document',

        'vocabulary.management': 'Vocabulary Management',
        'vocabulary.management.vocabularies': 'Vocabularies',
        'vocabulary.vocabularies.create': 'Create vocabulary',
        'vocabulary.vocabularies.create.tooltip': 'Create new vocabulary',
        'vocabulary.create.title': 'Create Vocabulary',
        'vocabulary.create.submit': 'Create',
        'vocabulary.create.iri.help': 'Identifier will be automatically generated based on the specified name. Or you can set it manually.',
        'vocabulary.name': 'Name',
        'vocabulary.iri': 'Identifier',
        'vocabulary.summary.title': '{name} - Summary',
        'vocabulary.detail.title': '{name} - Vocabulary Detail',

        'vocabulary.metadata.identifier': 'Identifier',
        'vocabulary.metadata.author': 'Author',
        'vocabulary.metadata.created': 'Created',

        'glossary.title': 'Glossary',
        'glossary.form.header': 'Create new term',
        'glossary.form.tooltipLabel': 'Didn´t find your term? Create new one.',
        'glossary.form.field.label': 'Label (required)',
        'glossary.form.field.uri': 'URI (required)',
        'glossary.form.field.description': 'Description',
        'glossary.form.field.selectParent': 'Select parent ...',
        'glossary.form.field.selectChildren': 'Select children ...',
        'glossary.form.field.propertyKey': 'Property key',
        'glossary.form.field.propertyValue': 'Property value',
        'glossary.form.button.addProperty': 'Add term property',
        'glossary.form.button.removeProperty': 'Remove term property',
        'glossary.form.button.showAdvancedSection': 'Show advanced options',
        'glossary.form.button.hideAdvancedSection': 'Hide advanced options',
        'glossary.form.button.submit': 'Submit',
        'glossary.form.button.cancel': 'Cancel',

        'glossary.form.validation.validateLengthMin5': 'Field must be at least 5 characters',
        'glossary.form.validation.validateLengthMin3': 'Field must be at least 3 characters',
        'glossary.form.validation.validateNotSameAsParent': 'Child option cannot be same as parent option',
    }
}