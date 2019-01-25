import * as React from 'react';
import Constants from '../../util/Constants';
import './LanguageSelector.scss';
import {connect} from 'react-redux';
import TermItState from '../../model/TermItState';
import {switchLanguage} from '../../action/SyncActions';
import {ThunkDispatch} from '../../util/Types';
import {Nav, NavItem, NavLink} from "reactstrap";

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
        return <NavItem className="language-selector">
            <Nav>
                <NavLink href="#" active={this.props.language === Constants.LANG.CS} onClick={this.onSelectCzech}>{Constants.LANG.CS.toUpperCase()}</NavLink>
                <span className="navbar-text">&nbsp;/&nbsp;</span>
                <NavLink href="#" active={this.props.language === Constants.LANG.EN} onClick={this.onSelectEnglish}>{Constants.LANG.EN.toUpperCase()}</NavLink>
            </Nav>
        </NavItem>;
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
