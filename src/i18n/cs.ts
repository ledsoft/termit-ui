import Constants from '../util/Constants';

export default {
    locale: Constants.LANG.CS,
    messages: {
        'please-wait': 'Prosím, čekejte...',
        "create": "Vytvořit",
        'save': 'Uložit',
        'cancel': 'Zrušit',
        'not-implemented': 'Zatím není naimplementováno!',
        'edit': 'Upravit',
        'optional': 'Nepovinné',
        'actions': 'Akce',
        'description': 'Popis',

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
        'main.nav.searchTerms': 'Vyhledávání pojmů',
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
        "dashboard.widget.typeFrequency.title": "Počet pojmů ve slovníku",
        "dashboard.widget.news": "Novinky",

        "asset.link.tooltip": "Zobrazit detail záznamu",
        "asset.iri": "Identifikátor",
        "asset.label": "Název",
        "asset.create.button.text": "Vytvořit",
        "asset.create.iri.help": "Identifikátor bude vygenerován automaticky na základě názvu. Můžete ho však též zadat ručně.",
        "asset.author": "Autor",
        "asset.created": "Vytvořeno",

        'vocabulary.management': 'Správa slovníků',
        'vocabulary.management.vocabularies': 'Slovníky',
        'vocabulary.vocabularies.create.tooltip': 'Vytvořit nový slovník',
        'vocabulary.vocabularies.create.text': 'Vytvořit',
        'vocabulary.create.title': 'Nový slovník',
        'vocabulary.create.submit': 'Vytvořit',
        'vocabulary.comment': 'Komentář',
        'vocabulary.summary.title': '{name} - přehled',
        'vocabulary.summary.gotodetail.label': 'Zobrazit pojmy v tomto slovníku',
        'vocabulary.summary.gotodetail.text': 'Zobrazit',
        'vocabulary.summary.export.title': 'Exportovat pojmy ze slovníku',
        'vocabulary.summary.export.text': 'Exportovat',
        'vocabulary.summary.export.csv': 'CSV',
        'vocabulary.summary.export.csv.title': 'Export do CSV',
        'vocabulary.summary.export.excel': 'Excel',
        'vocabulary.summary.export.excel.title': 'Export do formát MS Excel',
        'vocabulary.summary.export.error': 'Nepodařilo se získat data z odpovědi serveru.',
        'vocabulary.updated.message': 'Slovník úspěšně uložen.',
        'vocabulary.created.message': 'Slovník úspěšně vytvořen.',
        'vocabulary.detail.subtitle': 'Vytvořen autorem {author} ',
        'vocabulary.detail.tabs.metadata': 'Metadata',
        'vocabulary.detail.tabs.termdetail': 'Detail pojmu',
        'vocabulary.detail.files': 'Soubory',
        'vocabulary.detail.files.file': 'Název souboru',
        'vocabulary.detail.noTermSelected': 'Vyberte pojem ve stromečku vlevo.',

        'vocabulary.term.created.message': 'Pojem úspěšně vytvořen.',
        'vocabulary.select-vocabulary': 'Vyber slovník',

        'resource.management': 'Správa zdrojů',
        'resource.management.resources': 'Zdroje',
        "resource.created.message": "Zdroj úspěšně vytvořen.",
        'resource.updated.message': 'Zdroj úspěšně uložen.',

        "resource.create.title": "Vytvořit zdroj",
        "resource.management.create.text": "Vytvořit",
        "resource.management.create.tooltip": "Vytvořit či zaregistrovat zdroj",
        'resource.metadata.description': 'Popis',
        'resource.metadata.terms': 'Související pojmy',
        'resource.metadata-edit.terms': 'Související pojmy ze slovníku',

        'term.metadata.identifier': 'Identifikátor',
        'term.metadata.label': 'Název',
        'term.metadata.comment': 'Komentář',
        'term.metadata.subTerms': 'Podřazené pojmy',
        'term.metadata.types': 'Typy pojmu',
        'term.metadata.source': 'Zdroj pojmu',
        'term.updated.message': 'Pojem úspěšně aktualizován.',
        'term.metadata.labelExists.message': 'Pojem s názvem \'{label}\' již v tomto slovníku existuje',
        'term.metadata.source.add.placeholder': 'Nový zdroj pojmu',
        'term.metadata.source.add.placeholder.text': 'Přidat',
        'term.metadata.source.remove.title': 'Odebrat zdroj',
        'term.metadata.source.remove.text': 'Odebrat',
        'term.metadata.subterm.link': 'Zobrazit detail tohoto pojmu',
        'term.metadata.assignments.title': 'Anotované zdroje',
        'term.metadata.assignments.empty': 'Žádný zdroj není anotován tímto pojmem.',
        'term.metadata.assignments.resource': 'Zdroj',
        'term.metadata.assignments.resource.tooltip': 'Zobrazit detail tohoto zdroje',
        'term.metadata.assignments.description': 'Popis anotace',
        'term.metadata.assignments.type': 'Typ anotace',
        'term.metadata.assignments.count.tooltip': 'Pojem se v tomto zdroji vyskytuje {count, plural, one {jednou} other {# -krát}}',

        'glossary.title': 'Pojmy',
        'glossary.createTerm': 'Vytvořit nový pojem',
        'glossary.createTerm.tooltip': 'Vytvořit nový pojem ve slovníku',
        'glossary.createTerm.text': 'Vytvořit',
        'glossary.createTerm.breadcrumb': 'Vytvořit pojem',
        'glossary.form.header': 'Vytvořit nový pojem',
        'glossary.form.tooltipLabel': 'Nanašli jste pojem, který jste hledali? Vytvořte nový.',
        'glossary.form.field.label': 'Štítek (požadováno)',
        'glossary.form.field.uri': 'Identifikátor (požadováno)',
        'glossary.form.field.description': 'Popisek',
        'glossary.form.field.selectParent': 'Vybrat předchůdce ...',
        'glossary.form.field.selectChildren': 'Vybrat potomky ...',
        'glossary.form.field.selectType': 'Vyber typy',
        'glossary.form.field.source': 'Zdroj pojmu',
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

        'file.text-analysis.started.message': 'Soubor \'{fileName}\' zařazen do fronty pro textovou analýzu',
        'file.metadata.startTextAnalysis': 'Spustit textovou analýzu',
        'file.metadata.startTextAnalysis.text': 'Analyzovat',

        'statistics.vocabulary.count': 'Počet slovníků',
        'statistics.term.count': 'Počet pojmů',
        'statistics.user.count': 'Počet uživatelů',
        'statistics.notFilled': "Nevyplněno",
        'statistics.types.frequency': "Typy pojmů",

        'fullscreen.exit': 'Vrátit zobrazení do okna',
        'fullscreen.enter': 'Zobrazit na celou obrazovku',

        'search.title': 'Vyhledávání',
        'search.tab.dashboard': 'Nástěnka',
        'search.tab.everything': 'Hledat vše',
        'search.tab.terms': 'Pojmy',
        'search.tab.facets': 'Facetové vyhledávání',
        "search.reset": "Vymazat vyhledávání",
        "search.results.title": "Výsledky vyhledávání „{searchString}“",
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

        'annotator.annotate-content': 'Anotovat obsah',
        'annotation.form.suggested-occurrence.message': 'Fráze není přiřazena žádnemu termínu.',
        'annotation.form.invalid-occurrence.message': 'Termín "%" nebyl nalezen v slovníku. ',
        'annotation.form.assigned-occurrence.termInfoLabel': 'Informace o termínu:',
        'annotation.term.assigned-occurrence.termLabel': 'Přiřazený termín:',
        'annotation.term.occurrence.scoreLabel': 'Skóre:',
        'annotation.remove': 'Odebrat',
        'annotation.close': 'Zavřít',

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
        "type.dataset": "Datová sada"
    }
}
