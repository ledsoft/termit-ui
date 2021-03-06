import Constants from '../util/Constants';

export default {
    locale: Constants.LANG.CS.locale,
    messages: {
        'please-wait': 'Prosím, čekejte...',
        "create": "Vytvořit",
        'save': 'Uložit',
        'cancel': 'Zrušit',
        'not-implemented': 'Zatím není naimplementováno!',
        'edit': 'Upravit',
        "remove": "Odstranit",
        'optional': 'Nepovinné',
        'actions': 'Akce',
        'description': 'Popis',
        'submit' : 'Předložit',

        'connection.error': 'Nepodařilo se navázat spojení se serverem.',
        'ajax.unparseable-error': 'Akce selhala. Server odpověděl neznámou chybou. Více informací lze nalézt v konzoli prohlížeče.',
        'ajax.failed': 'Nepodařilo se načíst data ze serveru.',

        'footer.copyright': 'KBSS FEL ČVUT v Praze',
        'footer.version': 'Verze {version}',

        'login.title': 'Přihlášení',
        'login.username': 'Uživatelské jméno',
        'login.password': 'Heslo',
        'login.submit': 'Přihlásit',
        'login.register': 'Registrace',
        'login.error': 'Přihlášení se nezdařilo.',
        'login.progress-mask': 'Přihlašuji...',
        'login.locked': 'Účet je zablokován.',
        'login.disabled': 'Účet byl deaktivován.',

        'register.title': 'Nový uživatel',
        'register.first-name': 'Jméno',
        'register.last-name': 'Příjmení',
        'register.username': 'Uživatelské jméno',
        'register.password': 'Heslo',
        'register.password-confirm': 'Potvrzení hesla',
        'register.passwords-not-matching.tooltip': 'Heslo a jeho potvrzení se neshodují.',
        'register.submit': 'Registrovat',
        'register.mask': 'Registruji...',
        'register.error': 'Uživatele se nepodařilo zaregistrovat.',
        'register.login.error': 'Nepodařilo se přihlásit k nově vytvořenému uživateli.',
        'register.username-exists.tooltip': 'Uživatelské jméno již existuje',

        'main.nav.dashboard': 'Hlavní strana',
        'main.nav.vocabularies': 'Slovníky',
        'main.nav.resources': 'Datové zdroje',
        'main.nav.statistics': 'Statistiky',
        'main.nav.search': 'Vyhledávání',
        "main.nav.facetedSearch": "Facetové vyhledávání",
        'main.nav.searchTerms': 'Vyhledávání pojmů',
        'main.nav.searchVocabularies': 'Vyhledávání slovníků',
        'main.nav.admin': 'Administrace',
        'main.user-profile': 'Profil uživatele',
        'main.logout': 'Odhlásit se',
        'main.search.placeholder': 'Hledat',
        'main.search.tooltip': 'Přejít na stránku hledání',
        'main.search.count-info-and-link': 'Zobrazeno {displayed} z {count} výsledků. Zobrazit všechny.',
        'main.search.no-results': 'Nenalezeny žádné výsledky.',

        'dashboard.create-vocabulary.tile': 'Vytvořit slovník',
        'dashboard.create-resource.tile': "Vytvořit zdroj",

        "dashboard.widget.lastEdited.title": "Naposledy upravené záznamy",
        "dashboard.widget.lastEdited.empty": "Pro tuto část nebyly nalezeny žádné záznamy.",
        "dashboard.widget.lastEdited.lastEditDate": "Naposledy upraven/vytvořen",
        "dashboard.widget.lastEdited.lastEditMessage": "Záznam {operation, select, " +
            "edit {upraven}" +
            "other {vytvořen}" +
            "} uživatelem {user} {when}.",
        "dashboard.widget.typeFrequency.title": "Počet pojmů ve slovníku",
        "dashboard.widget.news": "Novinky",

        "administration.users": "Uživatelé",
        "administration.accessDenied": "K této obrazovce nemáte dostatečná oprávnění.",
        "administration.users.name": "Jméno",
        "administration.users.username": "Uživatelské jméno",
        "administration.users.status": "Status",
        "administration.users.status.locked": "Zablokovaný",
        "administration.users.status.locked.help": "Uživatelský účet byl zablokován z důvodu příliš mnoha neúspěšných pokusů o přihlášení. Uživatel se nemůže znovu přihlásit, dokud mu administrátor nenastaví nové heslo.",
        "administration.users.status.disabled": "Neaktivní",
        "administration.users.status.disabled.help": "Uživatelský účet byl deaktivován administrátorem a nelze se pod ním přihlásit.",
        "administration.users.status.active": "Aktivní",
        "administration.users.status.active.help": "Uživatelský účet je aktivní a lze se pod ním normálně přihlásit.",
        "administration.users.status.action.enable": "Aktivovat",
        "administration.users.status.action.enable.tooltip": "Aktivovat tohoto uživatele",
        "administration.users.status.action.enable.success": "Uživatel {name} aktivován.",
        "administration.users.status.action.disable": "Deaktivovat",
        "administration.users.status.action.disable.tooltip": "Deaktivovat tohoto uživatele",
        "administration.users.status.action.disable.success": "Uživatel {name} deaktivován.",
        "administration.users.status.action.unlock": "Odblokovat",
        "administration.users.status.action.unlock.tooltip": "Odblokovat tohoto uživatele",
        "administration.users.status.action.unlock.success": "Uživatel {name} odblokován.",
        "administration.users.unlock.title": "Odblokovat uživatele {name}",
        "administration.users.unlock.password": "Nové heslo",
        "administration.users.unlock.passwordConfirm": "Potvrzení nového hesla",

        "asset.link.tooltip": "Zobrazit detail záznamu",
        "asset.iri": "Identifikátor",
        "asset.label": "Název",
        "asset.create.button.text": "Vytvořit",
        "asset.create.iri.help": "Identifikátor bude vygenerován automaticky na základě názvu. Můžete ho však též zadat ručně.",
        "asset.author": "Autor",
        "asset.created": "Vytvořeno",
        "asset.remove.tooltip": "Odstranit tento záznam",
        "asset.remove.dialog.title": "Odstranit {type} \"{label}\"?",
        "asset.remove.dialog.text": "Určitě chcete odstranit {type} \"{label}\"?",

        'vocabulary.management': 'Správa slovníků',
        'vocabulary.management.vocabularies': 'Slovníky',
        'vocabulary.management.empty': 'Žádné slovníky nenalezeny. Vytvořte nějaký...',
        'vocabulary.vocabularies.create.tooltip': 'Vytvořit nový slovník',
        'vocabulary.vocabularies.create.text': 'Vytvořit',
        'vocabulary.create.title': 'Nový slovník',
        'vocabulary.create.submit': 'Vytvořit',
        'vocabulary.comment': 'Popis',
        'vocabulary.summary.title': '{name} - přehled',
        'vocabulary.summary.gotodetail.label': 'Zobrazit pojmy v tomto slovníku',
        'vocabulary.summary.gotodetail.text': 'Zobrazit',
        'vocabulary.summary.export.title': 'Exportovat pojmy ze slovníku',
        'vocabulary.summary.export.text': 'Exportovat',
        'vocabulary.summary.export.csv': 'CSV',
        'vocabulary.summary.export.csv.title': 'Export do CSV',
        'vocabulary.summary.export.excel': 'Excel',
        'vocabulary.summary.export.excel.title': 'Export do formát MS Excel',
        "vocabulary.summary.export.ttl": "SKOS (Turtle)",
        "vocabulary.summary.export.ttl.title": "Export glosáře ve struktuře kompatibilní se SKOS ve formátu Turtle",
        'vocabulary.summary.export.error': 'Nepodařilo se získat data z odpovědi serveru.',
        'vocabulary.updated.message': 'Slovník úspěšně uložen.',
        'vocabulary.created.message': 'Slovník úspěšně vytvořen.',
        'vocabulary.detail.subtitle': 'Vytvořen autorem {author} ',
        'vocabulary.detail.tabs.metadata': 'Metadata',
        'vocabulary.detail.tabs.termdetail': 'Detail pojmu',
        'vocabulary.detail.files': 'Soubory',
        'vocabulary.detail.files.file': 'Název souboru',
        'vocabulary.detail.noTermSelected': 'Vyberte pojem ve stromečku vlevo.',
        "vocabulary.detail.imports": "Importuje",
        "vocabulary.detail.imports.edit": "Importuje slovníky",
        "vocabulary.detail.document": "Dokument",

        'vocabulary.term.created.message': 'Pojem úspěšně vytvořen.',
        'vocabulary.select-vocabulary': 'Vyber slovník',

        'resource.management': 'Správa zdrojů',
        'resource.management.resources': 'Zdroje',
        "resource.created.message": "Zdroj úspěšně vytvořen.",
        'resource.updated.message': 'Zdroj úspěšně uložen.',
        "resource.removed.message": "Zdroj by odstraněn.",

        "resource.create.title": "Vytvořit zdroj",
        "resource.create.type": "Typ zdroje",
        "resource.create.file.select.label": "Přetáhněte sem soubor myší, nebo klikněte pro výběr pomocí dialogu",
        "resource.management.empty": "Žádné zdroje nenalezeny. Vytvořte nějaký...",
        "resource.management.create.text": "Vytvořit",
        "resource.management.create.tooltip": "Vytvořit či zaregistrovat zdroj",
        'resource.metadata.description': 'Popis',
        "resource.metadata.terms.assigned": "Přiřazené pojmy",
        "resource.metadata.terms.assigned.tooltip": "Pojmy přiřazené ke zdroji jako takovému",
        "resource.metadata.terms.occurrences": "Výskyty pojmů",
        "resource.metadata.terms.occurrences.tooltip": "Pojmy vyskytující se v obsahu zdroje",
        "resource.metadata.terms.occurrences.confirmed": "{count} - potvrzen",
        "resource.metadata.terms.occurrences.confirmed.tooltip": "Výskyt potvrzen či označen uživatelem",
        "resource.metadata.terms.occurrences.suggested": "{count} - návrh",
        "resource.metadata.terms.occurrences.suggested.tooltip": "Výskyt navržen systémem",
        'resource.metadata-edit.terms': 'Související pojmy ze slovníku',
        "resource.metadata.file.content": "Obsah",
        "resource.metadata.file.content.view": "Zobrazit",
        "resource.metadata.file.content.view.tooltip": "Zobrazit obsah souboru a anotovat ho",
        "resource.metadata.file.content.download": "Stáhnout",
        "resource.metadata.document.vocabulary": "Dokumentový slovník",
        "resource.metadata.document.files.create.tooltip": "Přidat nový soubor do tohoto dokumentu",
        "resource.metadata.document.files.create.dialog.title": "Nový soubor",
        "resource.metadata.document.files.empty": "Žádné soubory nenalezeny. Vytvořte nějaký...",
        "resource.document.vocabulary.create": "Vytvořit dokument",

        "term.metadata.definition": "Definice",
        'term.metadata.comment': 'Komentář',
        "term.metadata.parent": "Nadřazený pojem",
        'term.metadata.subTerms': 'Podřazené pojmy',
        'term.metadata.types': 'Typ pojmu',
        'term.metadata.source': 'Zdroj pojmu',
        'term.updated.message': 'Pojem úspěšně aktualizován.',
        'term.metadata.labelExists.message': "Pojem s názvem \"{label}\" již v tomto slovníku existuje",
        'term.metadata.source.add.placeholder': 'Nový zdroj pojmu',
        'term.metadata.source.add.placeholder.text': 'Přidat',
        'term.metadata.source.remove.title': 'Odebrat zdroj',
        'term.metadata.source.remove.text': 'Odebrat',
        'term.metadata.subterm.link': 'Zobrazit detail tohoto pojmu',
        "term.metadata.assignments.title": "Datové zdroje",
        "term.metadata.assignments.empty": "Žádný zdroj není anotován tímto pojmem.",
        "term.metadata.assignments.assignment": "Anotace",
        "term.metadata.assignments.assignment.assigned": "Zdroj je anotován pojmem",
        "term.metadata.assignments.assignment.not.assigned": "Zdroj pojmem anotován není",
        "term.metadata.assignments.assignment.help": "Anotace zdroje pojmem reprezentuje situaci kdy je pojem přiřazen zdroji jako takovému.",
        "term.metadata.assignments.occurrence": "Výskyt",
        "term.metadata.assignments.occurrence.help": "Výskyt pojmu popisuje situaci, kdy je výskyt pojmu lokalizován v obsahu datového zdroje (obvykle v textu).",
        "term.metadata.assignments.suggestedOccurrence": "Navržený výskyt",
        "term.metadata.assignments.suggestedOccurrence.help": "Navržený výskyt reprezentuje výskyt pojmu navržený systémem, např. na základě automatizované analýzy obsahu.",
        "term.metadata.assignments.count.tooltip": "Pojem se v tomto zdroji vyskytuje {count, plural, one {jednou} other {# -krát}}",
        "term.metadata.assignments.count.zero.tooltip": "Pojem se v tomto zdroji nevyskytuje",
        "term.metadata.vocabulary.tooltip": "Slovník, do kterého tento pojem patří",

        "glossary.title": "Pojmy",
        "glossary.select.placeholder": "Vyberte pojem",
        "glossary.excludeImported": "Včetně importů",
        "glossary.excludeImported.help": "Pojmy z importovaných slovníků jsou v tomto zobrazení skryté, kliknutím je zobrazíte",
        "glossary.includeImported": "Včetně importů",
        "glossary.includeImported.help": "Pojmy z importovaných slovníků jsou v tomto zobrazení viditelné, kliknutím je skryjete",
        "glossary.importedTerm.tooltip": "Pojem pochází z importovaného slovníku",
        'glossary.createTerm': 'Vytvořit nový pojem',
        'glossary.createTerm.tooltip': 'Vytvořit nový pojem ve slovníku',
        'glossary.createTerm.text': 'Vytvořit',
        'glossary.createTerm.breadcrumb': 'Vytvořit pojem',
        'glossary.form.header': 'Vytvořit nový pojem',
        'glossary.form.tooltipLabel': 'Nanašli jste pojem, který jste hledali? Vytvořte nový.',
        "glossary.form.field.parent": 'Nadřazený pojem',
        "glossary.form.field.source": 'Zdroj pojmu',
        'glossary.form.field.type': 'Typ pojmu',
        'glossary.form.button.addType': 'Přidat typ',
        'glossary.form.button.removeType': 'Odstranit typ',
        'glossary.form.button.showAdvancedSection': 'Zobrazit pokročilé možnosti',
        'glossary.form.button.hideAdvancedSection': 'Skrýt pokročilé možnosti',
        'glossary.form.button.submit': 'Vytvořit',
        'glossary.form.button.cancel': 'Zrušit',

        'glossary.form.validation.validateLengthMin5': 'Pole musí mít alespoň 5 znaků',
        'glossary.form.validation.validateLengthMin3': 'Pole musí mít alespoň 3 znaky',
        'glossary.form.validation.validateNotSameAsParent': 'Potomek nemůže být stejný jako předchůdce',

        'file.text-analysis.finished.message': "Textová analýza souboru \"{fileName}\" úspěšně dokončena.",
        'file.metadata.startTextAnalysis': 'Spustit textovou analýzu',
        'file.metadata.startTextAnalysis.text': 'Analyzovat',
        "file.content.upload.success": "Soubor \"{fileName}\" úspěšně nahrán na server.",
        "file.annotate.unknown-vocabulary": "Nelze určit slovník pro anotování tohoto souboru. Soubor nepatří slovníkovému dokumentu ani nebyl zpracován službou textové analýzy.",

        'statistics.vocabulary.count': 'Počet slovníků',
        'statistics.term.count': 'Počet pojmů',
        'statistics.user.count': 'Počet uživatelů',
        'statistics.notFilled': "Nevyplněno",
        'statistics.types.frequency': "Typy pojmů",

        'fullscreen.exit': 'Vrátit zobrazení do okna',
        'fullscreen.enter': 'Zobrazit na celou obrazovku',

        'search.title': 'Vyhledávání',
        'search.tab.dashboard': 'Nástěnka',
        'search.tab.everything': "Hledat ve všech záznamech",
        'search.tab.terms': 'Pojmy',
        "search.tab.vocabularies": "Slovníky",
        "search.tab.facets": "Facetové vyhledávání",
        "search.reset": "Vymazat vyhledávání",
        "search.results.title": "Výsledky vyhledávání „{searchString}“",
        "search.results.countInfo": "{matches, plural, one {Nalezen # výskyt} few {Nalezeny celkem # výskyty} other {Nalezeno celkem # výskytů}} {assets, plural, one {v # záznamu} other {v # záznamech}}.",
        "search.results.table.label": "Název",
        "search.results.table.label.tooltip": "Zobrazit detail objektu",
        "search.results.table.match": "Nalezená shoda",
        "search.results.table.score": "Skóre shody",
        "search.results.field.badge.tooltip": "Shoda nalezena v tomto atributu",
        "search.results.field.label": "Název",
        "search.results.field.comment": "Popis",
        "search.results.field.definition": "Definice",
        'search.slovnik': 'Slovník',
        'search.informace': 'Informace',
        'search.je-instanci-typu': 'je instancí typu',
        'search.je-specializaci': 'je specializací',
        'search.ma-vlastnosti-typu': 'má vlastnosti typu',
        'search.ma-vztahy-typu': 'má vztahy typu',
        'search.pojem': 'Pojem',
        'search.typ': 'Typ',

        'profile.first.name': 'Křestní jméno',
        'profile.last.name': 'Příjmení',
        'profile.legend.invalid.name': 'Pole musí mít alespoň 1 znak',
        'profile.updated.message': 'Profil byl úspěšně aktualizován',
        'profile.change-password': 'Změnit heslo',

        'change-password.current.password': 'Současné heslo',
        'change-password.new.password': 'Nové heslo',
        'change-password.confirm.password': 'Potvrzení hesla',
        'change-password.updated.message': 'Heslo bylo úspěšně změněno',
        'change-password.passwords.differ.tooltip': 'Staré a nové heslo se musí lišit.',

        'annotator.annotate-content': 'Anotovat obsah',
        'annotation.form.suggested-occurrence.message': 'Fráze není přiřazena žádnemu pojmu.',
        'annotation.form.invalid-occurrence.message': 'Pojem "%" nebyl nalezen v slovníku.',
        'annotation.form.assigned-occurrence.termInfoLabel': 'Informace o pojmu:',
        'annotation.term.assigned-occurrence.termLabel': 'Přiřazený pojem:',
        'annotation.term.occurrence.scoreLabel': 'Skóre:',
        'annotation.confirm': 'Potvrdit navrhovaný výskyt pojmu',
        'annotation.save': 'Uložit výskyt pojmu',
        'annotation.edit': 'Editovat výskyt pojmu',
        'annotation.remove': 'Odebrat výskyt pojmu',
        'annotation.close': 'Zavřít',

        'annotator.legend.confirmed.loading': 'Potvrzená anotace se načítá',
        'annotator.legend.confirmed.loading.tooltip': 'Annotace, kterou akceptoval uživatel se ještě načítá.',
        'annotator.legend.proposed.loading': 'Navrhovaná anotace se načítá',
        'annotator.legend.proposed.loading.tooltip': 'Annotace navrhovaná automatizovanou službou textové analýzy se ještě načítá.',
        'annotator.legend.confirmed.unknown.term': 'Potvrzený výskyt neznámého pojmu',
        'annotator.legend.confirmed.unknown.term.tooltip': 'Výskyt pojmu byl akceptován uživatelem avšak nebyl přiřazen ke konkrétnímu pojmu ve slovníku asociovaném s tímto dokumentem.',
        'annotator.legend.confirmed.existing.term': 'Potvrzený výskyt existujícího pojmu',
        'annotator.legend.confirmed.existing.term.tooltip': 'Výskyt pojmu byl akceptován uživatelem a tento pojem je ve slovníku asociovaném s tímto dokumentem.',
        'annotator.legend.confirmed.missing.term': 'Potvrzený výskyt chybějícího pojmu',
        'annotator.legend.confirmed.missing.term.tooltip': 'Výskyt pojmu byl akceptován uživatelem avšak slovník, ve kterém je pojem definován není asociovaný s tímto dokumentem.',
        'annotator.legend.proposed.unknown.term': 'Navrhovaný výskyt neznámého pojmu',
        'annotator.legend.proposed.unknown.term.tooltip': 'Výskyt pojmu byl identifikován automatizovanou službou textové analýzy avšak nebyl přiřazen ke konkrétnímu pojmu ve slovníku asociovaném s tímto dokumentem.',
        'annotator.legend.proposed.existing.term': 'Navrhovaný výskyt existujícího pojmu',
        'annotator.legend.proposed.existing.term.tooltip': 'Výskyt pojmu byl identifikován automatizovanou službou textové analýzy a tento pojem je ve slovníku asociovaném s tímto dokumentem.',
        'annotator.legend.proposed.missing.term': 'Navrhovaný výskyt chybějícího pojmu',
        'annotator.legend.proposed.missing.term.tooltip': 'Výskyt pojmu byl identifikován automatizovanou službou textové analýzy avšak slovník, ve kterém je pojem definován není asociovaný s tímto dokumentem.',
        'annotator.legend.toggle': 'Zobrazit/Skrýt legendu',
        'annotator.legend.toggle.label': 'Legenda',

        'message.welcome': 'Vítejte v aplikaci TermIt!',
        'link.external.title': '{url} - otevřít v nové záložce',
        'properties.edit.title': 'Další atributy',
        'properties.empty': 'Žádné další atributy nebyly nalezeny.',
        'properties.edit.remove': 'Odebrat tuto hodnotu',
        'properties.edit.remove.text': 'Odebrat',
        'properties.edit.property': 'Atribut',
        'properties.edit.value': 'Hodnota',
        'properties.edit.add.title': 'Přidat hodnotu atributu',
        'properties.edit.add.text': 'Přidat',
        'properties.edit.new': 'Vytvořit atribut',
        'properties.edit.new.iri': 'Identifikátor',
        'properties.edit.new.label': 'Název',
        'properties.edit.new.comment': 'Popis',

        "type.asset": "Záznam",
        "type.term": "Pojem",
        "type.vocabulary": "Slovník",
        "type.resource": "Zdroj",
        "type.document": "Dokument",
        "type.file": "Soubor",
        "type.dataset": "Datová sada",
        "type.document.vocabulary": "Dokumentový slovník",

        "log-viewer.title": "Prohlížení chyb",
        "log-viewer.timestamp": "Čas",
        "log-viewer.error": "Chyba",
        "log-viewer.clear": "Vyčistit",

        "error.vocabulary.update.imports.danglingTermReferences": "Nelze odstranit import slovníku, neboť stále existují vazby mezi pojmy z tohoto a importovaného slovníku (či ze slovníků, které importuje).",

        "history.label": "Historie",
        "history.loading": "Načítám historii...",
        "history.empty": "Zaznamenaná historie je prázdná.",
        "history.whenwho": "Původ",
        "history.type": "Typ",
        "history.type.persist": "Vytvoření",
        "history.type.update": "Změna",
        "history.changedAttribute": "Atribut",
        "history.originalValue": "Původní hodnota",
        "history.newValue": "Nová hodnota",

        "workspace.select.success": "Pracovní prostor \"{name}\" úspěšně načten."
    }
}
