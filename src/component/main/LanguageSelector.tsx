import * as React from 'react';
import * as classNames from 'classnames';
import Constants from '../../util/Constants';
import './LanguageSelector.scss';
import {connect} from 'react-redux';
import TermItState from '../../model/TermItState';
import {switchLanguage} from '../../action/SyncActions';
import {ThunkDispatch} from '../../util/Types';

interface LanguageSelectorProps {
    language: string,
    switchLanguage: (lang: string) => void
}

export class LanguageSelector extends React.Component<LanguageSelectorProps> {

    private onSelectCzech = () => {
        if (this.props.language === Constants.LANG.CS) {
            return;
        }
        this.props.switchLanguage(Constants.LANG.CS);
    };

    private onSelectEnglish = () => {
        if (this.props.language === Constants.LANG.EN) {
            return;
        }
        this.props.switchLanguage(Constants.LANG.EN);
    };

    public render() {
        const csCls = classNames('lang', {'selected': this.props.language === Constants.LANG.CS});
        const enCls = classNames('lang', {'selected': this.props.language === Constants.LANG.EN});
        return <li>
            <div className='language-selector'>
                <span className={csCls} onClick={this.onSelectCzech}>{Constants.LANG.CS.toUpperCase()}</span>
                &nbsp;/&nbsp;
                <span className={enCls} onClick={this.onSelectEnglish}>{Constants.LANG.EN.toUpperCase()}</span>
            </div>
        </li>;
    }
}

export default connect((state: TermItState) => {
    return {
        language: state.intl.locale
    };
}, (dispatch: ThunkDispatch) => {
    return {
        switchLanguage: (lang: string) => dispatch(switchLanguage(lang))
    }
})(LanguageSelector);