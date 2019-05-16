import * as React from "react";
import {injectIntl} from "react-intl";
import {
    CreateResourceMetadata,
    CreateResourceMetadataProps,
    CreateResourceMetadataState
} from "./CreateResourceMetadata";
import VocabularyUtils from "../../util/VocabularyUtils";
import withI18n from "../hoc/withI18n";
import {Col, Form, Label, Row} from "reactstrap";
import Dropzone from "react-dropzone";
import {GoCloudUpload} from "react-icons/go";
import classNames from "classnames";
import {connect} from "react-redux";
import {ThunkDispatch} from "../../util/Types";
import {uploadFileContent} from "../../action/AsyncActions";
import Resource from "../../model/Resource";

function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) {
        return "0B";
    }

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["B", "KB", "MB", "GB", "TB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

interface CreateFileMetadataProps extends CreateResourceMetadataProps {
    uploadFileContent: (fileIri: string, file: File) => void;
}

interface CreateFileMetadataState extends CreateResourceMetadataState {
    file?: File;
    dragActive: boolean;
}

export class CreateFileMetadata extends CreateResourceMetadata<CreateFileMetadataProps, CreateFileMetadataState> {

    constructor(props: CreateFileMetadataProps) {
        super(props);
        this.state = {
            iri: "",
            label: "",
            description: "",
            types: VocabularyUtils.RESOURCE,
            generateIri: true,
            file: undefined,
            dragActive: false
        }
    }

    public onFileSelected = (files: File[]) => {
        // There should be exactly one file
        const file = files[0];
        this.setState({file, label: file.name, dragActive: false});
        this.generateIri(file.name);
    };

    private onDragEnter = () => {
        this.setState({dragActive: true});
    };

    private onDragLeave = () => {
        this.setState({dragActive: false});
    };

    public onCreate = () => {
        const {generateIri, file, dragActive, ...data} = this.state;
        this.props.onCreate(new Resource(data)).then((iri: string) => {
            if (this.state.file) {
                this.props.uploadFileContent(this.state.iri, this.state.file);
            }
        });
    };

    public render() {
        const containerClasses = classNames("form-group", "create-resource-dropzone", {"active": this.state.dragActive});
        return <Form>
            <Row>
                <Col xl={this.props.wide ? 12 : 6} md={12}>
                    <Dropzone onDrop={this.onFileSelected} onDragEnter={this.onDragEnter}
                              onDragLeave={this.onDragLeave} multiple={false}>
                        {({getRootProps, getInputProps}) => (
                            <div {...getRootProps()} className={containerClasses}>
                                <input {...getInputProps()} />
                                <div>
                                    <Label
                                        className="placeholder-text w-100 text-center">{this.props.i18n("resource.create.file.select.label")}</Label>
                                </div>
                                <div className="w-100 icon-container text-center"><GoCloudUpload/></div>
                                {this.state.file && <div className="w-100 text-center">
                                    <Label>{this.state.file.name + " - " + formatBytes(this.state.file.size)}</Label>
                                </div>}
                            </div>
                        )}
                    </Dropzone>
                </Col>
            </Row>
            {this.renderBasicMetadataInputs()}
            {this.renderSubmitButtons()}
        </Form>;
    }
}

export default connect(undefined, (dispatch: ThunkDispatch) => {
    return {
        uploadFileContent: (fileIri: string, file: File) => dispatch(uploadFileContent(VocabularyUtils.create(fileIri), file))
    };
})(injectIntl(withI18n(CreateFileMetadata)));