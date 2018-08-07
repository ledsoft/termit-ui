import * as React from 'react';
import * as classNames from "classnames";
import I18nStore from "../../store/I18nStore";
import Constants from "../../util/Constants";

class LanguageSelector extends React.Component {

    private onSelectLang = () => {
        // Do nothing for now
    };

    public render() {

        const csCls = classNames("lang", {"selected": I18nStore.activeLanguage === Constants.LANG.CS});
        const enCls = classNames("lang", {"selected": I18nStore.activeLanguage === Constants.LANG.EN});
        return <li>
            <div className="lang">
                <a className={csCls} href="#" onClick={this.onSelectLang}>CS</a>
                &nbsp;/&nbsp;
                <a className={enCls} href="#" onClick={this.onSelectLang}>EN</a>
            </div>
        </li>;
    }
}

export default LanguageSelector;