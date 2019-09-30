import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../../hoc/withI18n";
import Document from "../../../model/Document";
import {Button, Card, CardBody, CardHeader, Modal, ModalBody} from "reactstrap";
import FileList from "../../file/FileList";
import CreateFileMetadata from "../file/CreateFileMetadata";
import File from "../../../model/File";
import {GoPlus} from "react-icons/go";
import VocabularyUtils from "../../../util/VocabularyUtils";
import {connect} from "react-redux";
import {ThunkDispatch} from "../../../util/Types";
import {createFileInDocument} from "../../../action/AsyncActions";

interface DocumentFilesProps extends HasI18n {
    document: Document;
    onFileAdded: () => void;
    createFile: (file: File, documentIri: string) => Promise<string>;
}

interface DocumentFilesState {
    createFileDialogOpen: boolean;
}

export class DocumentFiles extends React.Component<DocumentFilesProps, DocumentFilesState> {

    constructor(props: DocumentFilesProps) {
        super(props);
        this.state = {createFileDialogOpen: false};
    }

    private openCreateFileDialog = () => {
        this.setState({createFileDialogOpen: true});
    };

    private closeCreateFileDialog = () => {
        this.setState({createFileDialogOpen: false});
    };

    public createFile = (file: File) => {
        file.addType(VocabularyUtils.FILE);
        return this.props.createFile(file, this.props.document.iri).then(str => {
            this.closeCreateFileDialog();
            this.props.onFileAdded();
            return str;
        });
    };

    public render() {
        const doc = this.props.document;
        if (!doc) {
            return null;
        }
        const i18n = this.props.i18n;
        return <div className="card-no-margin-bottom mt-3">
            {this.renderCreateFileDialog()}
            <Card id="document-files">
                <CardHeader tag="h6" color="primary" className="d-flex align-items-center">
                    <div className="flex-grow-1">{i18n("vocabulary.detail.files")}</div>
                    <div className="float-sm-right">
                        <Button color="primary" size="sm" onClick={this.openCreateFileDialog}
                                title={i18n("resource.metadata.document.files.create.tooltip")}>
                            <GoPlus/>&nbsp;{i18n("asset.create.button.text")}
                        </Button>
                    </div>
                </CardHeader>
                <CardBody>
                    <FileList files={doc.files}/>
                </CardBody>
            </Card>
        </div>;
    }

    private renderCreateFileDialog() {
        return <Modal isOpen={this.state.createFileDialogOpen} toggle={this.closeCreateFileDialog}>
            <ModalBody>
                <Card id="document-create-file">
                    <CardHeader color="info">
                        <h5>{this.props.i18n("resource.metadata.document.files.create.dialog.title")}</h5>
                    </CardHeader>
                    <CardBody>
                        <CreateFileMetadata onCreate={this.createFile} onCancel={this.closeCreateFileDialog}
                                            wide={true}/>
                    </CardBody>
                </Card>
            </ModalBody>
        </Modal>;
    }
}

export default connect(undefined, (dispatch: ThunkDispatch) => {
    return {
        createFile: (file: File, documentIri: string) => dispatch(createFileInDocument(file, VocabularyUtils.create(documentIri)))
    };
})(injectIntl(withI18n(DocumentFiles)));