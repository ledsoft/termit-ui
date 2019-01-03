import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Col, Row} from "reactstrap";
import Vocabularies from "../vocabulary/Vocabularies";
import Resources from "../resource/Resources";
import WidgetToolbar from "./WidgetToolbar";

export class Dashboard extends React.Component<HasI18n> {

    public render() {
        return <>
            <Row>
                <Col>
                    <WidgetToolbar />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Vocabularies />
                </Col>
                <Col>
                    <Resources />
                </Col>
            </Row>
            </>;
    }

}

export default injectIntl(withI18n(Dashboard));
