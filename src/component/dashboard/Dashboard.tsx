import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Col, Row} from "reactstrap";
import Vocabularies from "../vocabulary/Vocabularies";
import Resources from "../resource/Resources";
import WidgetToolbar from "./WidgetToolbar";
import NewsMd from "./NewsMd";
import TermFrequency from "../statistics/termfrequency/TermFrequency";
import PanelWithActions from "../misc/PanelWithActions";
import templateQuery from "../statistics/termfrequency/TermFrequency.rq";

export class Dashboard extends React.Component<HasI18n> {

    public render() {
        return <>
            <WidgetToolbar />
            <Row>
                <Col className="col-4">
                    <Vocabularies />
                </Col>
                <Col className="col-4">
                    <Resources />
                </Col>
                <Col className="col-4">
                    <PanelWithActions title={this.props.i18n("dashboard.type-frequency")}>
                        <TermFrequency
                            sparqlQuery={templateQuery}
                            lang={this.props.locale}/>
                    </PanelWithActions>
                    <NewsMd />
                </Col>
            </Row>
            </>;
    }

}

export default injectIntl(withI18n(Dashboard));
