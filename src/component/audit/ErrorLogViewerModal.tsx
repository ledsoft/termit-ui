import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import ErrorLogViewer from "./ErrorLogViewer";

interface ErrorLogViewerModalProps extends HasI18n {
    show: boolean;
    onClose: () => void;
}

const ErrorLogViewerModal: React.SFC<ErrorLogViewerModalProps> = props => {
    return <Modal size="lg" isOpen={props.show} toggle={props.onClose}>
        <ModalHeader toggle={props.onClose}>{props.i18n("log-viewer.title")}</ModalHeader>
        <ModalBody>
            <ErrorLogViewer/>
        </ModalBody>
    </Modal>;
};

export default injectIntl(withI18n(ErrorLogViewerModal));