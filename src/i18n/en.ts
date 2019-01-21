import Constants from '../util/Constants';

export default {
    locale: Constants.LANG.EN,

    messages: {
        'please-wait': 'Please wait...',
        "create": "Create",
        'save': 'Save',
        'cancel': 'Cancel',
        'not-implemented': 'Not implemented, yet!',
        'edit': 'Edit',
        "remove": "Remove",
        'optional': 'Optional',
        'actions': 'Actions',
        'description': 'Description',

        'connection.error': 'Unable to connect to the server.',
        'ajax.unparseable-error': 'Action failed. Server responded with unexpected error. If necessary, see browser log for more details.',
        'ajax.failed': 'Unable to load data from the server.',

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
        'main.search.tooltip': 'Go to the search screen',
        'main.search.count-info-and-link': 'Showing {displayed} of {count} results. See all results.',
        'main.search.no-results': 'No results found.',

        'dashboard.create-vocabulary.tile': 'Create vocabulary',
        'dashboard.create-resource.tile': "Create resource",

        "dashboard.widget.lastEdited.title": "Last edited assets",
        "dashboard.widget.lastEdited.empty": "Found no assets to show here.",
        "dashboard.widget.lastEdited.lastEditDate": "Last edited/created",
        "dashboard.widget.typeFrequency.title": "Term count in vocabularies",
        "dashboard.widget.news": "News",

        "asset.link.tooltip": "View detail of this asset",
        "asset.iri": "Identifier",
        "asset.label": "Label",
        "asset.create.button.text": "Create",
        "asset.create.iri.help": "Identifier will be automatically generated based on the specified label. Or you can set it manually.",
        "asset.author": "Author",
        "asset.created": "Created",
        "asset.remove.tooltip": "Remove this asset",
        "asset.remove.dialog.title": "Remove {type} \'{label}\'?",
        "asset.remove.dialog.text": "Are you sure you want to remove {type} \'{label}\'?",

        'vocabulary.management': 'Vocabulary Management',
        'vocabulary.management.vocabularies': 'Vocabularies',
        'vocabulary.vocabularies.create.tooltip': 'Create new vocabulary',
        'vocabulary.create.title': 'Create Vocabulary',
        'vocabulary.create.submit': 'Create',
        'vocabulary.comment': 'Comment',
        'vocabulary.summary.title': '{name} - Summary',
        'vocabulary.summary.gotodetail.label': 'View terms in this vocabulary',
        'vocabulary.summary.gotodetail.text': 'View',
        'vocabulary.summary.export.title': 'Export glossary terms from this vocabulary',
        'vocabulary.summary.export.text': 'Export',
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
        'vocabulary.detail.files': 'Files',
        'vocabulary.detail.files.file': 'Filename',
        'vocabulary.detail.noTermSelected': 'Start by selecting a term in the tree on the left.',

        'vocabulary.term.created.message': 'Term successfully created.',
        'vocabulary.select-vocabulary': 'Select a Vocabulary',

        'resource.management': 'Resources management',
        'resource.management.resources': 'Resources',
        "resource.management.create.tooltip": "Create or upload a new resource",
        "resource.created.message": "Resource successfully created.",
        'resource.updated.message': 'Resource successfully updated.',

        "resource.create.title": "Create resource",
        "resource.create.type": "Type",
        'resource.metadata.description': 'Description',
        'resource.metadata.terms': 'Related Terms',
        'resource.metadata-edit.terms': 'Related Terms from the Vocabulary',

        'term.metadata.identifier': 'Identifier',
        'term.metadata.label': 'Label',
        'term.metadata.comment': 'Comment',
        'term.metadata.subTerms': 'Sub terms',
        'term.metadata.types': 'Types',
        'term.metadata.source': 'Source',
        'term.updated.message': 'Term successfully updated.',
        'term.metadata.labelExists.message': 'Term with label \'{label}\' already exists in this vocabulary',
        'term.metadata.source.add.placeholder': 'Add source',
        'term.metadata.source.add.placeholder.text': 'Add',
        'term.metadata.source.remove.title': 'Remove source',
        'term.metadata.source.remove.text': 'Remove',
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
        'file.metadata.startTextAnalysis.text': 'Analyze',

        'statistics.vocabulary.count': 'Vocabulary Count',
        'statistics.term.count': 'Term Count',
        'statistics.user.count': 'User Count',
        'statistics.notFilled': "Not Filled",
        'statistics.types.frequency': "Term Types",

        'fullscreen.exit': 'Exit fullscreen',
        'fullscreen.enter': 'Enter fullscreen',

        'search.title': 'Search',
        'search.tab.dashboard': 'Dashboard',
        'search.tab.everything': 'Search everything',
        'search.tab.terms': 'Terms',
        'search.tab.facets': 'Faceted search',
        "search.reset": "Reset search",
        "search.results.title": "Results for “{searchString}”",
        "search.results.table.label": "Label",
        "search.results.table.label.tooltip": "Open asset detail",
        "search.results.table.match": "Match",
        "search.results.table.score": "Match score",
        "search.results.field.badge.tooltip": "Matched attribute",
        "search.results.field.label": "Label",
        "search.results.field.comment": "Comment",
        "search.results.field.definition": "Definition",
        'search.slovnik': 'Vocabulary',
        'search.informace': 'Information',
        'search.je-instanci-typu': 'has type',
        'search.je-specializaci': 'specializes',
        'search.ma-vlastnosti-typu': 'has intrinsic trope types',
        'search.ma-vztahy-typu': 'has relation types',
        'search.pojem': 'Term',
        'search.typ': 'Type',

        'annotator.annotate-content': 'Annotate Content',
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
        'properties.edit.remove.text': 'Remove',
        'properties.edit.property': 'Property',
        'properties.edit.value': 'Value',
        'properties.edit.add.title': 'Add property value',
        'properties.edit.add.text': 'Add',
        'properties.edit.new': 'Create property',
        'properties.edit.new.iri': 'Identifier',
        'properties.edit.new.label': 'Label',
        'properties.edit.new.comment': 'Comment',

        "type.asset": "Asset",
        "type.term": "Term",
        "type.vocabulary": "Vocabulary",
        "type.resource": "Resource",
        "type.document": "Document",
        "type.file": "File",
        "type.dataset": "Dataset"
    }
}
