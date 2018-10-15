import Constants from '../util/Constants';

export default {
    locale: Constants.LANG.EN,

    messages: {
        'please-wait': 'Please wait...',
        'save': 'Save',
        'cancel': 'Cancel',
        'not-implemented': 'Not implemented, yet!',
        'edit': 'Edit',

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
        'main.nav.search': 'Search',
        'main.nav.facetedSearch': 'Faceted Search',
        'main.nav.admin': 'Administration',
        'main.user-profile': 'User profile',
        'main.logout': 'Log out',
        'main.search.placeholder': 'Search',
        'main.search.tooltip': 'Search in all vocabularies and terms',
        'main.search.count-info-and-link': 'Showing {displayed} of {count} results. See all results.',
        'main.search.no-results': 'No results found.',

        'dashboard.vocabulary.tile': 'Vocabulary Management',
        'dashboard.document.tile': 'Document Management',
        'dashboard.statistics.tile': 'Statistics',
        'dashboard.search.tile': 'Search',
        'dashboard.create-vocabulary.tile': 'Create Vocabulary',
        'dashboard.add-document.tile': 'Add Document',

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
        'vocabulary.summary.gotodetail.label': 'Detail',
        'vocabulary.created.message': 'Vocabulary successfully created.',
        'vocabulary.detail.subtitle': 'Created by {author} on {created}',
        'vocabulary.detail.tabs.metadata': 'Metadata',
        'vocabulary.detail.tabs.termdetail': 'Term Detail',
        'vocabulary.detail.tabs.annotations' : 'Document annotations',

        'vocabulary.term.created.message': 'Term successfully created.',

        'vocabulary.metadata.identifier': 'Identifier',
        'vocabulary.metadata.author': 'Author',
        'vocabulary.metadata.created': 'Created',

        'term.metadata.identifier': 'Identifier',
        'term.metadata.label': 'Label',
        'term.metadata.comment': 'Comment',
        'term.metadata.subTerms': 'Sub terms',
        'term.metadata.types': 'Types',
        'term.metadata.source': 'Source',
        'term.updated.message': 'Term successfully updated.',
        'term.metadata.labelExists.message': 'Term with label \'{label}\' already exists in this vocabulary',
        'term.metadata.source.add.placeholder': 'Add source',

        'glossary.title': 'Terms',
        'glossary.createTerm': 'Create new term',
        'glossary.createTerm.tooltip': "Create new vocabulary's term",
        'glossary.form.header': 'Create new term',
        'glossary.form.tooltipLabel': 'Didn\'t find your term? Create new one.',
        'glossary.form.field.label': 'Label (required)',
        'glossary.form.field.uri': 'URI (required)',
        'glossary.form.field.description': 'Description',
        'glossary.form.field.selectParent': 'Select parent ...',
        'glossary.form.field.selectChildren': 'Select children ...',
        'glossary.form.field.source': 'Term source',
        'glossary.form.field.type': 'Term type',
        'glossary.form.field.selectType': 'Select types',
        'glossary.form.button.addType': 'Add term type',
        'glossary.form.button.removeType': 'Remove term type',
        'glossary.form.button.showAdvancedSection': 'Show advanced options',
        'glossary.form.button.hideAdvancedSection': 'Hide advanced options',
        'glossary.form.button.submit': 'Submit',
        'glossary.form.button.cancel': 'Cancel',

        'glossary.form.validation.validateLengthMin5': 'Field must be at least 5 characters',
        'glossary.form.validation.validateLengthMin3': 'Field must be at least 3 characters',
        'glossary.form.validation.validateNotSameAsParent': 'Child option cannot be same as parent option',

        'statistics.vocabulary.count': 'Vocabulary Count',
        'statistics.term.count': 'Term Count',
        'statistics.user.count': 'User Count',

        'fullscreen.exit': 'Exit fullscreen',
        'fullscreen.enter': 'Enter fullscreen',

        'search.title': 'Search',
        'search.results.title': 'Results for \'{searchString}\'',
        'search.results.item.vocabulary.tooltip': 'Open vocabulary detail',
        'search.results.item.term.tooltip': 'Open term detail',
        'search.slovnik': 'Vocabulary',
        'search.informace': 'Information',
        'search.je-instanci-typu': 'has type',
        'search.je-specializaci': 'specializes',
        'search.ma-vlastnosti-typu': 'has intrinsic trope types',
        'search.ma-vztahy-typu': 'has relation types',
        'search.pojem': 'Term',
        'search.typ': 'Type',

        'annotation.form.suggestedterm.message': 'Phrase is not assigned to a vocabulary term.',
        'annotation.form.invalidterm.message': 'Term "%" not found in vocabulary.',
        'annotation.form.assignedterm.termInfoLabel': 'Term info : ',
        'annotation.term.assignedterm.termLabel': 'Assigned term : ',

        'message.welcome': 'Welcome to TermIt!',

        'type.term': 'Term',
        'type.vocabulary': 'Vocabulary'
    }
}