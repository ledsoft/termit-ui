import * as React from "react";
import classNames from "classnames";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "./hoc/withI18n";
import "./Footer.scss";
import Constants from "../util/Constants";
import {Col, Row} from "reactstrap";
import LanguageSelector from "./main/LanguageSelector";
import ErrorLogViewerModal from "./audit/ErrorLogViewerModal";
import {GoZap} from "react-icons/go";

interface FooterProps extends HasI18n {
    dark?: boolean;
}

interface FooterState {
    showLog: boolean;
}

class Footer extends React.Component<FooterProps, FooterState> {
    public static defaultProps = {
        dark: false
    };

    public constructor(props: FooterProps) {
        super(props);
        this.state = {
            showLog: false
        };
    }

    private toggleLogViewer = () => {
        this.setState({showLog: !this.state.showLog});
    };

    public render() {
        const i18n = this.props.i18n;
        return <footer className={classNames("container-fluid", {"footer-dark": this.props.dark})}>
            <Row className="justify-content-between">
                <Col className="footer-copyright text-left p-3 flex-grow-1">
                    &copy; <a href="https://kbss.felk.cvut.cz" target="_blank"
                              title={i18n("footer.copyright")}>{i18n("footer.copyright")}</a>, 2019
                </Col>
                <div className="p-2">
                    <LanguageSelector/>
                </div>
                <div>
                    <span onClick={this.toggleLogViewer} className="log-viewer-toggle"
                          title={i18n("log-viewer.title")}><GoZap/></span>
                    <ErrorLogViewerModal show={this.state.showLog} onClose={this.toggleLogViewer}/>
                </div>
                <div className="footer-version text-right p-3">
                    {this.props.formatMessage("footer.version", {version: Constants.VERSION})}
                </div>
            </Row>
        </footer>;
    }
}

export default injectIntl(withI18n(Footer));
