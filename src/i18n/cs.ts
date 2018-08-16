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
        'vocabulary.detail.title': '{name} - Detail slovníků',

        'glossary.title': 'Glosář'
    }
}