import Constants from '../util/Constants';

export default {
    locale: Constants.LANG.CS,

    messages: {
        'please-wait': 'Prosím, čekejte...',
        'connection.error': 'Nepodařilo se navázat spojení se serverem.',
        'ajax.unparseable-error': 'Akce selhala. Server odpověděl neznámou chybou. Více informací lze nalézt v konzoli prohlížeče.',
        'footer.copyright': 'KBSS FEL ČVUT v Praze',

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
        'register.passwords-not-matching-tooltip': 'Heslo a jeho potvrzení se neshodují.',
        'register.submit': 'Registrovat',
        'register.mask': 'Registruji...',
        'register.error': 'Uživatele se nepodařilo zaregistrovat.',
        'register.login.error': 'Nepodařilo se přihlásit k nově vytvořenému uživateli.',

        'main.dashboard.nav': 'Hlavní strana',
        'main.statistics.nav': 'Statistiky',
        'main.admin.nav': 'Administrace',
        'main.user-profile': 'Profil uživatele',
        'main.logout': 'Odhlásit se',
        'main.search.placeholder': 'Hledat',
        'main.search.tooltip': 'Hledat daný výraz ve všech slovnících a pojmech',
    }
}