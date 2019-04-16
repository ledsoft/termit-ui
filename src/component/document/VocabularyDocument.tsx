import * as React from "react";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {injectIntl} from "react-intl";
import Vocabulary from "../../model/Vocabulary";
import FileList from "../file/FileList";
import {Button, Card, CardBody, CardHeader, Modal, ModalBody} from "reactstrap";
import {GoPlus} from "react-icons/go";
import "./VocabularyDocument.scss";
import CreateFileMetadata from "../resource/CreateFileMetadata";
import File from "../../model/File";
import {connect} from "react-redux";
import {ThunkDispatch} from "../../util/Types";
import {createFileInDocument} from "../../action/AsyncActions";
import VocabularyUtils from "../../util/VocabularyUtils";

interface VocabularyDocumentDispatchProps {
    createFile: (file: File, documentIri: string) => Promise<string>;
}

interface VocabularyDocumentProps extends HasI18n {
    vocabulary: Vocabulary;
}

type ActualProps = VocabularyDocumentProps & VocabularyDocumentDispatchProps;

interface VocabularyDocumentState {
    createFileDialogOpen: boolean;
}

/**
 * Displays Vocabulary Document, i.e., mainly the files it contains.
 *
 * Also allows to add a new file, including uploading of its content.
 */
export class VocabularyDocument extends React.Component<ActualProps, VocabularyDocumentState> {

    constructor(props: ActualProps) {
        super(props);
        this.state = {
            createFileDialogOpen: false
        };
    }

    private openCreateFileDialog = () => {
        this.setState({createFileDialogOpen: true});
    };

    private closeCreateFileDialog = () => {
        this.setState({createFileDialogOpen: false});
    };

    public createFile = (file: File): Promise<string> => {
        file.addType(VocabularyUtils.FILE);
        return this.props.createFile(file, this.props.vocabulary.document!.iri).then(str => {
            this.setState({createFileDialogOpen: false});
            return str;
        });
    };

    public render() {
        const i18n = this.props.i18n;
        if (this.props.vocabulary.document && this.props.vocabulary.document.files) {
            return <div className="card-no-margin-bottom">
                {this.renderCreateFileDialog()}
                <hr/>
                <Card id="vocabulary-document">
                    <CardHeader tag="h5" color="primary" className="d-flex align-items-center">
                        <div className="flex-grow-1">{i18n("vocabulary.detail.files")}</div>
                        <div className="float-sm-right">
                            <Button color="primary" size="sm" onClick={this.openCreateFileDialog}
                                    title={i18n("vocabulary.detail.files.create.tooltip")}>
                                <GoPlus/>&nbsp;{i18n("asset.create.button.text")}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <FileList files={this.props.vocabulary.document!.files}/>
                    </CardBody>
                </Card>
            </div>;
        } else {
            return null;
        }
    }

    private renderCreateFileDialog() {
        return <Modal isOpen={this.state.createFileDialogOpen} toggle={this.closeCreateFileDialog}>
            <ModalBody>
                <Card id="vocabulary-document-create-file">
                    <CardHeader color="info">
                        <h5>{this.props.i18n("vocabulary.detail.files.create.dialog.title")}</h5>
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
})(injectIntl(withI18n(VocabularyDocument)));