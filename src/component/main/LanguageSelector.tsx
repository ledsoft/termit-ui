import * as React from "react";
import Constants from "../../util/Constants";
import "./LanguageSelector.scss";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {switchLanguage} from "../../action/SyncActions";
import {ThunkDispatch} from "../../util/Types";
import {DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown} from "reactstrap";

interface LanguageSelectorProps {
    language: string,
    switchLanguage: (lang: string) => void
}

export class LanguageSelector extends React.Component<LanguageSelectorProps> {

    public onSelect = (lang: string) => {
        if (this.props.language === lang) {
            return;
        }
        this.props.switchLanguage(lang);
    };

    private resolveSelectedLanguage(): string {
        const selected = Object.getOwnPropertyNames(Constants.LANG).find(p => Constants.LANG[p].locale === this.props.language);
        return Constants.LANG[selected!].label;
    }

    public render() {
        return <UncontrolledDropdown dir="up">
            <DropdownToggle name="language-selector" caret={true} nav={true}>
                {this.resolveSelectedLanguage()}
            </DropdownToggle>
            <DropdownMenu right={true}>
                <DropdownItem name="language-selector.cs"
                              onClick={this.onSelect.bind(null, Constants.LANG.CS.locale)}>{Constants.LANG.CS.label}</DropdownItem>
                <DropdownItem nane="language-selector.en"
                              onClick={this.onSelect.bind(null, Constants.LANG.EN.locale)}>{Constants.LANG.EN.label}</DropdownItem>
            </DropdownMenu>
        </UncontrolledDropdown>;
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
