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

function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) {
        return "0B";
    }

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

interface CreateFileMetadataState extends CreateResourceMetadataState {
    file?: File;
    dragActive: boolean;
}

export class CreateFileMetadata extends CreateResourceMetadata<CreateFileMetadataState> {

    constructor(props: CreateResourceMetadataProps) {
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

    private onFileSelected = (files: File[]) => {
        // There should be exactly one file
        this.setState({file: files[0], dragActive: false});
    };

    private onDragEnter = () => {
        this.setState({dragActive: true});
    };

    private onDragLeave = () => {
        this.setState({dragActive: false});
    };

    public render() {
        const containerClasses = classNames("form-group", "create-resource-dropzone", {"active": this.state.dragActive});
        return <Form>
            <Row>
                <Col md={12} xl={6}>
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

export default injectIntl(withI18n(CreateFileMetadata));