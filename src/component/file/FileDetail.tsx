import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from '../hoc/withI18n';
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {loadFileContent} from "../../action/ComplexActions";
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
    loadContentFile: (documentIri: IRI, fileName: string) => void
    intl: IntlData
}

// TODO "file detail" --> "file content detail"
export class FileDetail extends React.Component<FileDetailProps> {

    public componentDidMount(): void {
        const normalizedFileName = this.props.match.params.name;
        this.props.loadContentFile(VocabularyUtils.create(this.props.document.iri), normalizedFileName);
    }

    // private onAnnotate = () => {
    // };
    //
    // private onSave = () => {
    // };

    public render() {
        // const actions = [];
        // actions.push(<Button key='glossary.edit'
        //                          color='secondary'
        //                          title={"annotate"}
        //                          size='sm'
        //                          onClick={this.onAnnotate}>{"✎"}</Button>);
        // actions.push(<Button key='glossary.save'
        //                          color='secondary'
        //                          title={"save"}
        //                          size='sm'
        //                          onClick={this.onSave}>{"✓"}</Button>);
        return (this.props.fileContent) ? <Annotator html={this.props.fileContent} intl={this.props.intl}/> : null;
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
        loadContentFile: (documentIri: IRI, fileName: string) => dispatch(loadFileContent(documentIri, fileName)),
    };
})(injectIntl(withI18n(FileDetail)));