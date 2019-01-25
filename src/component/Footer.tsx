import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "./hoc/withI18n";
import "./Footer.scss";
import Constants from "../util/Constants";
import {Col, Row} from "reactstrap";

interface FooterProps extends HasI18n {
}

const Footer: React.SFC<FooterProps> = (props) => {
    const i18n = props.i18n;
    return <footer className="container-fluid">
        <Row className="justify-content-between">
            <Col className="footer-copyright text-left p-3">
                &copy; <a href="https://kbss.felk.cvut.cz" target="_blank"
                          title={i18n("footer.copyright")}>{i18n("footer.copyright")}</a>, 2018
            </Col>
            <Col className="footer-version text-right p-3">
                {props.formatMessage("footer.version", {version: Constants.VERSION})}
            </Col>
        </Row>
    </footer>;
};

export default injectIntl(withI18n(Footer));
