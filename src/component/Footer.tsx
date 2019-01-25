import * as React from "react";
import classNames from "classnames";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "./hoc/withI18n";
import "./Footer.scss";
import Constants from "../util/Constants";
import {Col, Row} from "reactstrap";
import LanguageSelector from "./main/LanguageSelector";

interface FooterProps extends HasI18n {
    dark?: boolean;
}

const Footer: React.SFC<FooterProps> = (props) => {
    const i18n = props.i18n;
    return <footer className={classNames("container-fluid", {"footer-dark": props.dark})}>
        <Row className="justify-content-between">
            <Col className="footer-copyright text-left p-3 flex-grow-1">
                &copy; <a href="https://kbss.felk.cvut.cz" target="_blank"
                          title={i18n("footer.copyright")}>{i18n("footer.copyright")}</a>, 2018
            </Col>
            <div className="p-2">
                <LanguageSelector/>
            </div>
            <div className="footer-version text-right p-3">
                {props.formatMessage("footer.version", {version: Constants.VERSION})}
            </div>
        </Row>
    </footer>;
};

Footer.defaultProps = {
    dark: false
};

export default injectIntl(withI18n(Footer));
