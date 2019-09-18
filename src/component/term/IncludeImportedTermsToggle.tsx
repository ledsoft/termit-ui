import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {UncontrolledTooltip} from "reactstrap";
import Toggle from "react-bootstrap-toggle";
import "./IncludeImportedTermsToggle.scss";

interface IncludeImportedTermsToggleProps extends HasI18n {
    onToggle: () => void;
    includeImported: boolean;
    id: string; // Toggle id, required by the tooltip component
    style?: object;
}

const IncludeImportedTermsToggle: React.FC<IncludeImportedTermsToggleProps> = props => {
    let toggleStyle = {height: "calc(1.5 * 0.875rem + 0.5rem + 2px)"};
    if (props.style) {
        toggleStyle = Object.assign(toggleStyle, props.style);
    }
    return <>
        <label className="option-label">{props.i18n("glossary.includeImported")}</label>
        <Toggle id={props.id} onClick={props.onToggle}
                onstyle="primary"
                offstyle="secondary"
                size="sm"
                onClassName="toggle-custom"
                offClassName="toggle-custom"
                handleClassName="toggle-handle-custom"
                style={toggleStyle}
                active={props.includeImported}
                recalculateOnResize={true}/>
        <UncontrolledTooltip target={props.id} placement="right">
            {props.i18n(props.includeImported ? "glossary.includeImported.help" : "glossary.excludeImported.help")}
        </UncontrolledTooltip>
    </>;
};

export default injectIntl(withI18n(IncludeImportedTermsToggle));
