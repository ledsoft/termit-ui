import Constants from '../util/Constants';

export default {
    locale: Constants.LANG.CS,

    messages: {
        'please-wait': 'Prosím, čekejte...',
        'cancel': 'Zrušit',

        'connection.error': 'Nepodařilo se navázat spojení se serverem.',
        'ajax.unparseable-error': 'Akce selhala. Server odpověděl neznámou chybou. Více informací lze nalézt v konzoli prohlížeče.',

        'footer.copyright': 'KBSS FEL ČVUT v Praze',
        'footer.version': 'Verze {version}',

        'login.title': Constants.APP_NAME + ' - Přihlášení',
        'login.username': 'Uživatelské jméno',
        'login.password': 'Heslo',
        'login.submit': 'Přihlásit',
        'login.register': 'Registrace',
        'login.error': 'Přihlášení se nezdařilo.',
        'login.progress-mask': 'Přihlašuji...',
        'login.locked': 'Účet je zablokován.',
        'login.disabled': 'Účet byl deaktivován.',

        'register.title': Constants.APP_NAME + ' - Nový uživatel',
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
        'main.nav.statistics': 'Statistiky',
        'main.nav.search': 'Vyhledávání pojmů',
        'main.nav.facetedSearch': 'Facetové vyhledávání pojmů',
        'main.nav.admin': 'Administrace',
        'main.user-profile': 'Profil uživatele',
        'main.logout': 'Odhlásit se',
        'main.search.placeholder': 'Hledat',
        'main.search.tooltip': 'Hledat daný výraz ve všech slovnících a pojmech',
        'main.search.count-info-and-link': 'Zobrazeno {displayed} z {count} výsledků. Zobrazit všechny.',

        'dashboard.vocabulary.tile': 'Správa slovníků',
        'dashboard.document.tile': 'Správa dokumentů',
        'dashboard.statistics.tile': 'Statistiky',
        'dashboard.search.tile': 'Search',
        'dashboard.create-vocabulary.tile' : 'Vytvořit slovník',
        'dashboard.add-document.tile' : 'Přidat dokument',

        'vocabulary.management': 'Správa slovníků',
        'vocabulary.management.vocabularies': 'Slovníky',
        'vocabulary.vocabularies.create': 'Vytvořit slovník',
        'vocabulary.vocabularies.create.tooltip': 'Vytvořit nový slovník',
        'vocabulary.create.title': 'Nový slovník',
        'vocabulary.create.submit': 'Vytvořit',
        'vocabulary.create.iri.help': 'Identifikátor bude vygenerován automaticky na základě názvu slovníku. Můžete ho však též zadat ručně.',
        'vocabulary.name': 'Název',
        'vocabulary.iri': 'Identifikátor',
        'vocabulary.summary.title': '{name} - přehled',
        'vocabulary.summary.gotodetail.label' : 'Detail',
        'vocabulary.created.message': 'Slovník úspěšně vytvořen.',
        'vocabulary.detail.subtitle': 'Vytvořen autorem {author} v {created}',
        'vocabulary.detail.tabs.metadata' : 'Metadata',
        'vocabulary.detail.tabs.termdetail' : 'Detail pojmu',
        'vocabulary.detail.tabs.annotations' : 'Anotace',

        'vocabulary.term.created.message': 'Pojem úspěšně vytvořen.',

        'vocabulary.metadata.identifier': 'Identifikátor',
        'vocabulary.metadata.author': 'Autor',
        'vocabulary.metadata.created': 'Datum vytvoření',

        'term.metadata.identifier': 'Identifikátor',
        'term.metadata.label': 'Popisek',
        'term.metadata.comment': 'Komentář',
        'term.metadata.subTerms': 'Identifikátory potomků',
        'term.metadata.types': 'Typ/y pojmu',
        'term.metadata.source': 'Zdroj pojmu',

        'glossary.title': 'Pojmy',
        'glossary.createTerm': 'Vytvořit nový pojem',
        'glossary.createTerm.tooltip': 'Vytvořit nový pojem ve slovníku',
        'glossary.form.header': 'Vytvořit nový pojem',
        'glossary.form.tooltipLabel': 'Nanašli jste pojem, který jste hledali? Vytvořte nový.',
        'glossary.form.field.label': 'Štítek (požadováno)',
        'glossary.form.field.uri': 'Identifikátor (požadováno)',
        'glossary.form.field.description': 'Popisek',
        'glossary.form.field.selectParent': 'Vybrat předchůdce ...',
        'glossary.form.field.selectChildren': 'Vybrat potomky ...',
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

        'statistics.vocabulary.count' : 'Počet slovníků',
        'statistics.term.count' : 'Počet pojmů',
        'statistics.user.count' : 'Počet uživatelů',

        'fullscreen.exit' : 'Vrátit zobrazení do okna',
        'fullscreen.enter' : 'Zobrazit na celou obrazovku',

        'search.slovnik' : 'Slovník',
        'search.informace' : 'Informace',
        'search.je-instanci-typu' : 'je instancí typu',
        'search.je-specializaci' : 'je specializací',
        'search.ma-vlastnosti-typu' : 'má vlastnosti typu',
        'search.ma-vztahy-typu' : 'má vztahy typu',
        'search.pojem' : 'Pojem',
        'search.typ' : 'Typ',

        'message.welcome': 'Vítejte v aplikaci TermIt!',

        'type.term': 'Pojem',
        'type.vocabulary': 'Slovník'
    }
}