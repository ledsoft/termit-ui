import * as React from "react";
import {HasI18n} from "../hoc/withI18n";
import {injectIntl} from "react-intl";
import withI18n from "../hoc/withI18n";

export default injectIntl(withI18n((props: HasI18n) => {
    const i18n = props.i18n;
    return <div id={"legend"} className={"legend-sticky"}>
        <div>
            <span className="loading-term-occurrence"
                  title={i18n("annotator.legend.loading.tooltip")}>{i18n("annotator.legend.loading")}</span>&nbsp;
            <span className="suggested-term-occurrence"
                  title={i18n("annotator.legend.confirmed.unknown.term.tooltip")}>{i18n("annotator.legend.confirmed.unknown.term")}</span>&nbsp;
            <span className="assigned-term-occurrence"
                  title={i18n("annotator.legend.confirmed.existing.term.tooltip")}>{i18n("annotator.legend.confirmed.existing.term")}</span>&nbsp;
            <span className="invalid-term-occurrence"
                  title={i18n("annotator.legend.confirmed.missing.term.tooltip")}>{i18n("annotator.legend.confirmed.missing.term")}</span>&nbsp;
        </div>
        <div>
            <span className="proposed-occurrence loading-term-occurrence"
                  title={i18n("annotator.legend.proposed.loading.tooltip")}>{i18n("annotator.legend.loading")}</span>&nbsp;
            <span className="proposed-occurrence suggested-term-occurrence"
                  title={i18n("annotator.legend.proposed.unknown.term.tooltip")}>{i18n("annotator.legend.proposed.unknown.term")}</span>&nbsp;
            <span className="proposed-occurrence assigned-term-occurrence"
                  title={i18n("annotator.legend.proposed.existing.term.tooltip")}>{i18n("annotator.legend.proposed.existing.term")}</span>&nbsp;
            <span className="proposed-occurrence invalid-term-occurrence"
                  title={i18n("annotator.legend.proposed.missing.term.tooltip")}>{i18n("annotator.legend.proposed.missing.term")}</span>
        </div>
    </div>
}));


