import * as React from 'react';
import * as classNames from "classnames";
import I18nStore from '../../store/I18nStore';
import Constants from '../../util/Constants';
import './LanguageSelector.scss';

class LanguageSelector extends React.Component {

    private onSelectCzech = () => {
        I18nStore.activeLanguage = Constants.LANG.CS;
        window.location.reload();   // TODO: Rewrite this to store current language in the Redux store so that the
                                    // application does not have to be refreshed
    };

    private onSelectEnglish = () => {
        I18nStore.activeLanguage = Constants.LANG.EN;
        window.location.reload();
    };

    public render() {
        const csCls = classNames("lang", {"selected": I18nStore.activeLanguage === Constants.LANG.CS});
        const enCls = classNames("lang", {"selected": I18nStore.activeLanguage === Constants.LANG.EN});
        return <li>
            <div className="lang">
                <a className={csCls} href="#" onClick={this.onSelectCzech}>{Constants.LANG.CS.toUpperCase()}</a>
                &nbsp;/&nbsp;
                <a className={enCls} href="#" onClick={this.onSelectEnglish}>{Constants.LANG.EN.toUpperCase()}</a>
            </div>
        </li>;
    }
}

export default LanguageSelector;