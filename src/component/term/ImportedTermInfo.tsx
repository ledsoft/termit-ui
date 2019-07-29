import * as React from "react";
import {injectIntl} from "react-intl";
import Term from "../../model/Term";
import {GoFileSymlinkDirectory} from "react-icons/go";
import "./ImportedTermInfo.scss";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Tooltip} from "reactstrap";
import Utils from "../../util/Utils";

interface ImportedTermInfoProps extends HasI18n {
    term: Term;
}

interface ImportedTermInfoState {
    showTooltip: boolean;
}


class ImportedTermInfo extends React.Component<ImportedTermInfoProps, ImportedTermInfoState> {

    constructor(props: ImportedTermInfoProps) {
        super(props);
        this.state = {
            showTooltip: false
        };
    }

    private toggleTooltip = () => {
        this.setState({showTooltip: !this.state.showTooltip});
    };

    public render() {
        const id = "imported-term-info-" + Utils.hashCode(this.props.term.iri);
        return <div className="imported-term-info" id={id}>
            <Tooltip target={id} toggle={this.toggleTooltip} isOpen={this.state.showTooltip}>
                {this.props.i18n("glossary.importedTerm.tooltip")}
            </Tooltip>
            <GoFileSymlinkDirectory/>
        </div>;
    }
}

export default injectIntl(withI18n(ImportedTermInfo));