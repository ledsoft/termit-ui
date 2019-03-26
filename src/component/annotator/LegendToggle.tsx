import * as React from "react";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {injectIntl} from "react-intl";
import {GoTriangleRight} from "react-icons/go";
import Legend from "./Legend";


interface LegendToggleState {
    showLegend: boolean;
}

class LegendToggle extends React.Component<HasI18n, LegendToggleState> {

    public constructor(props:HasI18n) {
        super(props);
        this.state = {
            showLegend: true
        };
    }

    private toggleLegend = () => {
        this.setState({showLegend: !this.state.showLegend});
    };

    public render () {
        return  <div id={"legend"} className={"legend-sticky d-inline-flex px-1"}>
                <span className={"legend-title"} onClick={this.toggleLegend}
                      title={this.props.i18n("annotator.legend.toggle")}>{this.props.i18n("annotator.legend.toggle.label")}<GoTriangleRight/></span>
                {this.state.showLegend ? <Legend/> : null}
            </div>
    }
}
export default (injectIntl(withI18n(LegendToggle)));