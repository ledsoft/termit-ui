import Constants from '../util/Constants';

export default {
    locale: Constants.LANG.EN,

    messages: {
        'please-wait': 'Please wait...',
        'save': 'Save',
        'cancel': 'Cancel',
        'not-implemented': 'Not implemented, yet!',
        'edit': 'Edit',
        'optional': 'Optional',
        'actions': 'Actions',
        'description': 'Description',

        'connection.error': 'Unable to connect to the server.',
        'ajax.unparseable-error': 'Action failed. Server responded with unexpected error. If necessary, see browser log for more details.',

        'footer.copyright': 'KBSS at FEE CTU in Prague',
        'footer.version': 'Version {version}',

        'login.title': 'Log in',
        'login.username': 'Username',
        'login.password': 'Password',
        'login.submit': 'Login',
        'login.register': 'Register',
        'login.error': 'Authentication failed.',
        'login.progress-mask': 'Logging in...',
        'login.locked': 'Account locked.',
        'login.disabled': 'Account disabled.',

        'register.title': 'Registration',
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
        'main.nav.resources': 'Resources',
        'main.nav.statistics': 'Statistics',
        'main.nav.search': 'Search',
        'main.nav.searchTerms': 'Search terms',
        'main.nav.resourceDetail': 'Resource Detail',
        'main.nav.admin': 'Administration',
        'main.user-profile': 'User profile',
        'main.logout': 'Log out',
        'main.search.placeholder': 'Search',
        'main.search.tooltip': 'Search in all vocabularies and terms',
        'main.search.count-info-and-link': 'Showing {displayed} of {count} results. See all results.',
        'main.search.no-results': 'No results found.',

        'dashboard.vocabulary.tile': 'Vocabulary Management',
        'dashboard.resource.tile': 'Resource Management',
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
        'vocabulary.name': 'Label',
        'vocabulary.iri': 'Identifier',
        'vocabulary.comment': 'Comment',
        'vocabulary.summary.title': '{name} - Summary',
        'vocabulary.summary.gotodetail.label': 'View terms in this vocabulary',
        'vocabulary.summary.export.title': 'Export glossary terms from this vocabulary',
        'vocabulary.summary.export.csv': 'CSV',
        'vocabulary.summary.export.csv.title': 'Export to CSV',
        'vocabulary.summary.export.excel': 'Excel',
        'vocabulary.summary.export.excel.title': 'Export to MS Excel',
        'vocabulary.summary.export.error': 'Unable to retrieve exported data from server response.',
        'vocabulary.updated.message': 'Vocabulary successfully updated.',
        'vocabulary.created.message': 'Vocabulary successfully created.',
        'vocabulary.detail.subtitle': 'Created by {author} on ',
        'vocabulary.detail.tabs.metadata': 'Metadata',
        'vocabulary.detail.tabs.termdetail': 'Term Detail',
        'vocabulary.detail.files' : 'Files',
        'vocabulary.detail.files.file': 'Filename',
        'vocabulary.detail.noTermSelected': 'Start by selecting a term in the tree on the left.',

        'vocabulary.term.created.message': 'Term successfully created.',

        'vocabulary.metadata.identifier': 'Identifier',
        'vocabulary.metadata.author': 'Author',
        'vocabulary.metadata.created': 'Created',

        'resource.management': 'Resources management',
        'resource.management.resources': 'Resources',
        'resource.updated.message': 'Resource successfully updated.',
        'resource.management.add': 'Add resource',

        'resource.metadata.identifier' : 'Identifier',
        'resource.metadata.label' : 'Label',
        'resource.metadata.comment' : 'Comment',
        'resource.metadata.terms' : 'Related Terms',

        'term.metadata.identifier': 'Identifier',
        'term.metadata.label': 'Label',
        'term.metadata.comment': 'Comment',
        'term.metadata.subTerms': 'Sub terms',
        'term.metadata.types': 'Types',
        'term.metadata.source': 'Source',
        'term.updated.message': 'Term successfully updated.',
        'term.metadata.labelExists.message': 'Term with label \'{label}\' already exists in this vocabulary',
        'term.metadata.source.add.placeholder': 'Add source',
        'term.metadata.source.remove.title': 'Remove source',
        'term.metadata.subterm.link': 'View detail of this term',
        'term.metadata.assignments.title': 'Annotated resources',
        'term.metadata.assignments.empty': 'This term is not assigned to any resources.',
        'term.metadata.assignments.resource': 'Resource',
        'term.metadata.assignments.resource.tooltip': 'View detail of this resource',
        'term.metadata.assignments.description': 'Assignment description',
        'term.metadata.assignments.type': 'Assignment type',
        'term.metadata.assignments.count.tooltip': 'The term occurs {count, plural, one {# time} other {# times}} in this resource',

        'glossary.title': 'Terms',
        'glossary.createTerm': 'Create new term',
        'glossary.createTerm.tooltip': "Create new vocabulary's term",
        'glossary.createTerm.breadcrumb': 'Create term',
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

        'file.text-analysis.started.message': 'File \'{fileName}\' successfully queued for text analysis',
        'file.metadata.startTextAnalysis': 'Start text analysis',

        'statistics.vocabulary.count': 'Vocabulary Count',
        'statistics.term.count': 'Term Count',
        'statistics.user.count': 'User Count',
        'statistics.notFilled' : "Not Filled",
        'statistics.types.frequency' : "Term Types",

        'fullscreen.exit': 'Exit fullscreen',
        'fullscreen.enter': 'Enter fullscreen',

        'search.title': 'Search',
        'search.tab.everything': 'Search everything',
        'search.tab.terms': 'Terms',
        'search.tab.facets': 'Faceted search',
        'search.results.title': 'Results for \'{searchString}\'',
        'search.slovnik': 'Vocabulary',
        'search.informace': 'Information',
        'search.je-instanci-typu': 'has type',
        'search.je-specializaci': 'specializes',
        'search.ma-vlastnosti-typu': 'has intrinsic trope types',
        'search.ma-vztahy-typu': 'has relation types',
        'search.pojem': 'Term',
        'search.typ': 'Type',

        'annotation.form.suggested-occurrence.message': 'Phrase is not assigned to a vocabulary term.',
        'annotation.form.invalid-occurrence.message': 'Term \'%\' not found in vocabulary.',
        'annotation.form.assigned-occurrence.termInfoLabel': 'Term info : ',
        'annotation.term.assigned-occurrence.termLabel': 'Assigned term : ',
        'annotation.term.occurrence.scoreLabel': 'Score:',
        'annotation.remove': 'Remove',
        'annotation.close': 'Close',

        'message.welcome': 'Welcome to TermIt!',
        'link.external.title': '{url} - open in a new browser tab',
        'properties.edit.title': 'Additional properties',
        'properties.empty': 'There are no additional properties here.',
        'properties.edit.remove': 'Remove this property value',
        'properties.edit.property': 'Property',
        'properties.edit.value': 'Value',
        'properties.edit.add.title': 'Add property value',
        'properties.edit.new': 'Create property',
        'properties.edit.new.iri': 'Identifier',
        'properties.edit.new.label': 'Label',
        'properties.edit.new.comment': 'Comment',

        'type.term': 'Term',
        'type.vocabulary': 'Vocabulary'
    }
}
