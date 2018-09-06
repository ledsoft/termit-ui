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
        'main.nav.admin': 'Administrace',
        'main.user-profile': 'Profil uživatele',
        'main.logout': 'Odhlásit se',
        'main.search.placeholder': 'Hledat',
        'main.search.tooltip': 'Hledat daný výraz ve všech slovnících a pojmech',

        'dashboard.vocabulary.tile': 'Správa slovníků',
        'dashboard.document.tile': 'Správa dokumentů',
        'dashboard.statistics.tile': 'Statistiky',
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
        'vocabulary.detail.title': '{name} - Detail slovníku',
        'vocabulary.created.message': 'Slovník úspěšně vytvořen.',

        'vocabulary.metadata.identifier': 'Identifikátor',
        'vocabulary.metadata.author': 'Autor',
        'vocabulary.metadata.created': 'Datum vytvoření',

        'glossary.title': 'Glosář',
        'glossary.form.header': 'Vytvořit nový pojem',
        'glossary.form.tooltipLabel': 'Nanašli jste pojem, který jste hledali? Vytvořte nový.',
        'glossary.form.field.label': 'Štítek (požadováno)',
        'glossary.form.field.uri': 'Identifikátor (požadováno)',
        'glossary.form.field.description': 'Popisek',
        'glossary.form.field.selectParent': 'Vybrat předchůdce ...',
        'glossary.form.field.selectChildren': 'Vybrat potomky ...',
        'glossary.form.field.propertyKey': 'Klíč',
        'glossary.form.field.propertyValue': 'Hodnota',
        'glossary.form.button.addProperty': 'Přidat záznam',
        'glossary.form.button.removeProperty': 'Odstranit záznam',
        'glossary.form.button.showAdvancedSection': 'Zobrazit pokročilé možnosti',
        'glossary.form.button.hideAdvancedSection': 'Skrýt pokročilé možnosti',
        'glossary.form.button.submit': 'Dokončit',
        'glossary.form.button.cancel': 'Zrušit',

        'glossary.form.validation.validateLengthMin5': 'Pole musí mít alespoň 5 znaků',
        'glossary.form.validation.validateLengthMin3': 'Pole musí mít alespoň 3 znaky',
        'glossary.form.validation.validateNotSameAsParent': 'Potomek nemůže být stejný jako předchůdce',

        'message.welcome': 'Vítejte v aplikaci TermIt!',
    }
}