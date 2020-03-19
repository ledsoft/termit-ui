import Constants from '../util/Constants';

export default {
    locale: Constants.LANG.EN.locale,

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
        'submit': 'Submit',

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
        "main.nav.facetedSearch": "Faceted search",
        'main.nav.searchTerms': 'Search terms',
        'main.nav.searchVocabularies': 'Search vocabularies',
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
        "dashboard.widget.lastEdited.lastEditMessage": "{operation, select, " +
            "edit {Edited} " +
            "other {Created} " +
            "} by {user} {when}.",
        "dashboard.widget.typeFrequency.title": "Term count in vocabularies",
        "dashboard.widget.news": "News",

        "administration.users": "Users",
        "administration.accessDenied": "You have insufficient rights to access this view.",
        "administration.users.name": "Name",
        "administration.users.username": "Username",
        "administration.users.status": "Status",
        "administration.users.status.locked": "Locked",
        "administration.users.status.locked.help": "User account is locked due to exceeding the maximum amount of unsuccessful login attempts. User cannot log in under this account unless an administrator sets a new password for it.",
        "administration.users.status.disabled": "Disabled",
        "administration.users.status.disabled.help": "User account has been disabled by an administrator and cannot be used to log in.",
        "administration.users.status.active": "Active",
        "administration.users.status.active.help": "User account is active and can be used to log in as usual.",
        "administration.users.status.action.enable": "Enable",
        "administration.users.status.action.enable.tooltip": "Enable this user",
        "administration.users.status.action.enable.success": "User {name} successfully enabled.",
        "administration.users.status.action.disable": "Disable",
        "administration.users.status.action.disable.tooltip": "Disable this user",
        "administration.users.status.action.disable.success": "User {name} successfully disabled.",
        "administration.users.status.action.unlock": "Unlock",
        "administration.users.status.action.unlock.tooltip": "Unlock this user",
        "administration.users.status.action.unlock.success": "User {name} successfully unlocked.",
        "administration.users.unlock.title": "Unlock user {name}",
        "administration.users.unlock.password": "New password",
        "administration.users.unlock.passwordConfirm": "Confirm new password",

        "asset.link.tooltip": "View detail of this asset",
        "asset.iri": "Identifier",
        "asset.label": "Label",
        "asset.create.button.text": "Create",
        "asset.create.iri.help": "Identifier will be automatically generated based on the specified label. Or you can set it manually.",
        "asset.author": "Author",
        "asset.created": "Created",
        "asset.remove.tooltip": "Remove this asset",
        "asset.remove.dialog.title": "Remove {type} \"{label}\"?",
        "asset.remove.dialog.text": "Are you sure you want to remove {type} \"{label}\"?",

        'vocabulary.management': 'Vocabulary Management',
        'vocabulary.management.vocabularies': 'Vocabularies',
        'vocabulary.management.empty': 'No vocabularies found. Start by creating one.',
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
        "vocabulary.summary.export.ttl": "SKOS (Turtle)",
        "vocabulary.summary.export.ttl.title": "Export SKOS-compatible glossary serialized as Turtle",
        'vocabulary.summary.export.error': 'Unable to retrieve exported data from server response.',
        'vocabulary.updated.message': 'Vocabulary successfully updated.',
        'vocabulary.created.message': 'Vocabulary successfully created.',
        'vocabulary.detail.subtitle': 'Created by {author} on ',
        'vocabulary.detail.tabs.metadata': 'Metadata',
        'vocabulary.detail.tabs.termdetail': 'Term Detail',
        'vocabulary.detail.files': 'Files',
        'vocabulary.detail.files.file': 'Filename',
        'vocabulary.detail.noTermSelected': 'Start by selecting a term in the tree on the left.',
        "vocabulary.detail.imports": "Imports",
        "vocabulary.detail.imports.edit": "Imports vocabularies",
        "vocabulary.detail.document": "Document",

        'vocabulary.term.created.message': 'Term successfully created.',
        'vocabulary.select-vocabulary': 'Select a Vocabulary',

        'resource.management': 'Resources management',
        'resource.management.resources': 'Resources',
        "resource.management.empty": "No resources found. Start by registering some.",
        "resource.management.create.tooltip": "Create or upload a new resource",
        "resource.created.message": "Resource successfully created.",
        'resource.updated.message': 'Resource successfully updated.',
        "resource.removed.message": "Resource successfully removed.",

        "resource.create.title": "Create resource",
        "resource.create.type": "Type",
        "resource.create.file.select.label": "Drag & drop a file here, or click to select file",
        'resource.metadata.description': 'Description',
        "resource.metadata.terms.assigned": "Assigned terms",
        "resource.metadata.terms.assigned.tooltip": "Terms assigned to the resource as a whole",
        "resource.metadata.terms.occurrences": "Occurring terms",
        "resource.metadata.terms.occurrences.tooltip": "Terms occurring in the resource content",
        "resource.metadata.terms.occurrences.confirmed": "{count} - confirmed",
        "resource.metadata.terms.occurrences.confirmed.tooltip": "Occurrence confirmed/created by a user",
        "resource.metadata.terms.occurrences.suggested": "{count} - suggested",
        "resource.metadata.terms.occurrences.suggested.tooltip": "Occurrence suggested by the system",
        'resource.metadata-edit.terms': 'Related terms from the vocabulary',
        "resource.metadata.file.content": "Content",
        "resource.metadata.file.content.view": "View",
        "resource.metadata.file.content.view.tooltip": "View file content and annotate it",
        "resource.metadata.file.content.download": "Download",
        "resource.metadata.document.vocabulary": "Document vocabulary",
        "resource.metadata.document.files.create.tooltip": "Add new file to this document",
        "resource.metadata.document.files.create.dialog.title": "New file",
        "resource.metadata.document.files.empty": "No files found. Start by adding some.",
        "resource.document.vocabulary.create": "Create document",

        "term.metadata.definition": "Definition",
        'term.metadata.comment': 'Comment',
        "term.metadata.parent": "Parent term",
        'term.metadata.subTerms': 'Sub terms',
        'term.metadata.types': 'Type',
        'term.metadata.source': 'Source',
        'term.updated.message': 'Term successfully updated.',
        'term.metadata.labelExists.message': "Term with label \"{label}\" already exists in this vocabulary",
        'term.metadata.source.add.placeholder': 'Add source',
        'term.metadata.source.add.placeholder.text': 'Add',
        'term.metadata.source.remove.title': 'Remove source',
        'term.metadata.source.remove.text': 'Remove',
        'term.metadata.subterm.link': 'View detail of this term',
        "term.metadata.assignments.title": "Related resources",
        "term.metadata.assignments.empty": "This term is not assigned to any resources.",
        "term.metadata.assignments.assignment": "Assignment",
        "term.metadata.assignments.assignment.assigned": "Term is assigned to this resource",
        "term.metadata.assignments.assignment.not.assigned": "Term is not assigned to this resource",
        "term.metadata.assignments.assignment.help": "Term assignment represents situations when term is assigned to the resource as a whole.",
        "term.metadata.assignments.occurrence": "Occurrence",
        "term.metadata.assignments.occurrence.help": "Term occurrence denotes situations when an occurrence of the term is localized in the resource (usually a file) content.",
        "term.metadata.assignments.suggestedOccurrence": "Suggested occurrence",
        "term.metadata.assignments.suggestedOccurrence.help": "Suggested term occurrence represents a term occurrence suggested by the system, e.g., based on the analysis of the content.",
        "term.metadata.assignments.count.tooltip": "The term occurs {count, plural, one {# time} other {# times}} in this resource",
        "term.metadata.assignments.count.zero.tooltip": "The term does not occur in this resource",
        "term.metadata.vocabulary.tooltip": "Vocabulary this term belongs to",

        "glossary.title": "Terms",
        "glossary.select.placeholder": "Select term",
        "glossary.excludeImported": "Include imported",
        "glossary.excludeImported.help": "Terms from imported vocabularies are hidden in this view, click to show them",
        "glossary.includeImported": "Include imported",
        "glossary.includeImported.help": "Terms from imported vocabularies are shown in this view, click to hide them",
        "glossary.importedTerm.tooltip": "Term belongs to an imported vocabulary",
        'glossary.createTerm': 'Create new term',
        'glossary.createTerm.tooltip': "Create new vocabulary's term",
        'glossary.createTerm.breadcrumb': 'Create term',
        'glossary.form.header': 'Create Term',
        'glossary.form.tooltipLabel': 'Didn\'t find your term? Create new one.',
        "glossary.form.field.parent": 'Parent term',
        "glossary.form.field.source": 'Term source',
        'glossary.form.field.type': 'Term type',
        'glossary.form.button.addType': 'Add term type',
        'glossary.form.button.removeType': 'Remove term type',
        'glossary.form.button.showAdvancedSection': 'Show advanced options',
        'glossary.form.button.hideAdvancedSection': 'Hide advanced options',
        'glossary.form.button.submit': 'Submit',
        'glossary.form.button.cancel': 'Cancel',

        'glossary.form.validation.validateLengthMin5': 'Field must be at least 5 characters',
        'glossary.form.validation.validateLengthMin3': 'Field must be at least 3 characters',
        'glossary.form.validation.validateNotSameAsParent': 'Child option cannot be same as parent option',

        'file.text-analysis.finished.message': "Text analysis of file \"{fileName}\" successfully finished.",
        'file.metadata.startTextAnalysis': 'Start text analysis',
        'file.metadata.startTextAnalysis.text': 'Analyze',
        "file.content.upload.success": "Content of file \"{fileName}\" successfully uploaded.",
        "file.annotate.unknown-vocabulary": "Unable to determine vocabulary for annotating this file. It neither belongs to a vocabulary document nor has been processed by text analysis.",

        'statistics.vocabulary.count': 'Vocabulary Count',
        'statistics.term.count': 'Term Count',
        'statistics.user.count': 'User Count',
        'statistics.notFilled': "Not Filled",
        'statistics.types.frequency': "Term Types",

        'fullscreen.exit': 'Exit fullscreen',
        'fullscreen.enter': 'Enter fullscreen',

        'search.title': 'Search',
        'search.tab.dashboard': 'Dashboard',
        'search.tab.everything': "Search in all assets",
        'search.tab.terms': 'Terms',
        "search.tab.vocabularies": "Vocabularies",
        "search.tab.facets": "Faceted search",
        "search.reset": "Reset search",
        "search.results.title": "Results for \"{searchString}\"",
        "search.results.countInfo": "Found {matches} matches in {assets} assets.",
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

        'profile.first.name': 'First name',
        'profile.last.name': 'Last name',
        'profile.legend.invalid.name': 'Field must be at least 1 character',
        'profile.updated.message': 'Profile successfully updated',
        'profile.change-password': 'Change Password',

        'change-password.current.password': 'Current password',
        'change-password.new.password': 'New password',
        'change-password.confirm.password': 'Confirm password',
        'change-password.updated.message': 'Password successfully updated',
        'change-password.passwords.differ.tooltip': 'Old password and new password should not be same.',

        'annotator.annotate-content': 'Annotate Content',
        'annotation.form.suggested-occurrence.message': 'Phrase is not assigned to a vocabulary term.',
        'annotation.form.invalid-occurrence.message': 'Term \'%\' not found in vocabulary.',
        'annotation.form.assigned-occurrence.termInfoLabel': 'Term info : ',
        'annotation.term.assigned-occurrence.termLabel': 'Assigned term : ',
        'annotation.term.occurrence.scoreLabel': 'Score:',
        'annotation.confirm': 'Confirm suggestion of term occurrence',
        'annotation.save': 'Save term occurrence',
        'annotation.edit': 'Edit term occurrence',
        'annotation.remove': 'Remove term occurrence',
        'annotation.close': 'Close',

        'annotator.legend.confirmed.loading': 'Loading confirmed annotation',
        'annotator.legend.confirmed.loading.tooltip': 'Annotation that was accepted by a user is still loading.',
        'annotator.legend.proposed.loading': 'Loading proposed annotation',
        'annotator.legend.proposed.loading.tooltip': 'Annotation that was proposed by the annotation service is still loading.',
        'annotator.legend.confirmed.unknown.term': 'Confirmed occurrence of an unknown term',
        'annotator.legend.confirmed.unknown.term.tooltip': 'Occurrence of a term was accepted by a user but not assigned to a term in a vocabulary associated to this document yet.',
        'annotator.legend.confirmed.existing.term': 'Confirmed occurrence of an existing term',
        'annotator.legend.confirmed.existing.term.tooltip': 'Occurrence of a term was accepted by a user and the term is in a vocabulary associated to this document.',
        'annotator.legend.confirmed.missing.term': 'Confirmed occurrence of a missing term',
        'annotator.legend.confirmed.missing.term.tooltip': 'Occurrence of a term was accepted by a user but a vocabulary related to the term and associated to this document is missing.',
        'annotator.legend.proposed.unknown.term': 'Proposed occurrence of an unknown term',
        'annotator.legend.proposed.unknown.term.tooltip': 'Occurrence of a term was identified by the text analysis service but not assigned to a term in a vocabulary associated to this document yet.',
        'annotator.legend.proposed.existing.term': 'Proposed occurrence of an existing term',
        'annotator.legend.proposed.existing.term.tooltip': 'Occurrence of a term was identified by the text analysis service and the term is in a vocabulary associated to this document.',
        'annotator.legend.proposed.missing.term': 'Proposed occurrence of a missing term',
        'annotator.legend.proposed.missing.term.tooltip': 'Occurrence of a term was accepted by the text analysis service but a vocabulary related to the term and associated to this document is missing.',
        'annotator.legend.toggle': 'Show/Hide legend',
        'annotator.legend.toggle.label': 'Legend',

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
        "type.dataset": "Dataset",
        "type.document.vocabulary": "Document vocabulary",

        "log-viewer.title": "Error log",
        "log-viewer.timestamp": "Timestamp",
        "log-viewer.error": "Error",
        "log-viewer.clear": "Clear log",

        "error.vocabulary.update.imports.danglingTermReferences": "Cannot remove vocabulary import(s), there are still references between terms from this vocabulary and the imported one (or one of its imports).",

        "history.label": "History",
        "history.loading": "Loading history...",
        "history.empty": "The recorded history of this asset is empty.",
        "history.whenwho": "Origin",
        "history.type": "Type",
        "history.type.persist": "Creation",
        "history.type.update": "Update",
        "history.changedAttribute": "Attribute",
        "history.originalValue": "Original value",
        "history.newValue": "New value"
    }
};
