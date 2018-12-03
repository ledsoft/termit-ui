import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from '../hoc/withI18n';
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {loadFileContent, saveFileContent} from "../../action/AsyncActions";
import Document from "../../model/Document";
import {RouteComponentProps} from "react-router";
import VocabularyUtils, {IRI} from "../../util/VocabularyUtils";
import Vocabulary from "../../model/Vocabulary";
import IntlData from "../../model/IntlData";
import {ThunkDispatch} from "../../util/Types";
import {Annotator} from "../annotator/Annotator";


interface FileDetailProps extends HasI18n, RouteComponentProps<any> {
    vocabulary: Vocabulary,
    document: Document,
    fileContent: string | null
    loadFileContent: (documentIri: IRI, fileName: string) => void,
    saveFileContent: (documentIri: IRI, fileName: string, fileContent: string) => void
    intl: IntlData
}

// TODO "file detail" --> "file content detail"
export class FileDetail extends React.Component<FileDetailProps> {

    public componentDidMount(): void {
        const normalizedFileName = this.props.match.params.name;
        this.props.loadFileContent(VocabularyUtils.create(this.props.document.iri), normalizedFileName);
    }

    private onUpdate = (newFileContent: string) => {
        const normalizedFileName = this.props.match.params.name;
        this.props.saveFileContent(VocabularyUtils.create(this.props.document.iri), normalizedFileName, newFileContent);
    };

    public render() {
        return (this.props.fileContent) ? <Annotator html={this.props.fileContent} onUpdate={this.onUpdate} intl={this.props.intl}/> : null;
    }
}

export default connect((state: TermItState) => {
    return {
        vocabulary: state.vocabulary,
        document: state.document,
        fileContent: state.fileContent,
        intl: state.intl
    };
}, (dispatch: ThunkDispatch) => {
    return {
        loadFileContent: (documentIri: IRI, fileName: string) => dispatch(loadFileContent(documentIri, fileName)),
        saveFileContent: (documentIri: IRI, fileName: string, fileContent: string) => dispatch(saveFileContent(documentIri, fileName, fileContent))
    };
})(injectIntl(withI18n(FileDetail)));