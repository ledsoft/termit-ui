import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../../hoc/withI18n";
import Document from "../../../model/Document";
import Utils from "../../../util/Utils";
import {Card, CardBody, CardHeader} from "reactstrap";
import FileList from "../../file/FileList";

interface DocumentFilesProps extends HasI18n {
    document: Document;
}

export class DocumentFiles extends React.Component<DocumentFilesProps> {

    public render() {
        const doc = this.props.document;
        if (!doc || Utils.sanitizeArray(doc.files).length === 0) {
            return null;
        }
        return <div className="card-no-margin-bottom mt-3">
            <Card id="document-files">
                <CardHeader tag="h6" color="primary" className="d-flex align-items-center">
                    <div className="flex-grow-1">{this.props.i18n("vocabulary.detail.files")}</div>
                </CardHeader>
                <CardBody>
                    <FileList files={doc.files}/>
                </CardBody>
            </Card>
        </div>;
    }
}

export default injectIntl(withI18n(DocumentFiles));