import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Button, Table} from "reactstrap";
import File from "../../model/File";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {ThunkDispatch} from "../../util/Types";
import {startFileTextAnalysis} from "../../action/AsyncActions";
import {GoClippy} from "react-icons/go";
import VocabularyFileLink from "../vocabulary/VocabularyFileLink";
import Vocabulary, {EMPTY_VOCABULARY} from "../../model/Vocabulary";


interface FileListProps extends HasI18n {
    vocabulary: Vocabulary,
    files: File[],
    startFileTextAnalysis: (file: File) => void
}

export class FileList extends React.Component<FileListProps> {

    private fileTextAnalysisCallback = (file: File) => {
        return () => this.props.startFileTextAnalysis(file);
    };

    public render() {
        const i18n = this.props.i18n;
        if (this.props.files.length > 0 && (this.props.vocabulary !== EMPTY_VOCABULARY)) {
            const rows = this.props.files.map(v =>
                <tr key={v.iri}>
                    <td className="align-middle">
                        <VocabularyFileLink resource={v} vocabulary={this.props.vocabulary}/>
                    </td>
                    <td className="align-middle">
                        {v.comment}
                    </td>
                    <td className="pull-right">
                        <Button className="link-to-resource" size="sm" color="primary"
                                title={i18n("file.metadata.startTextAnalysis")}
                                onClick={this.fileTextAnalysisCallback(v)}><GoClippy/> {i18n("file.metadata.startTextAnalysis.text")}
                        </Button>
                    </td>
                </tr>
            );
            return <div>
                <Table borderless={true}>
                    <thead>
                    <tr>
                        <th>{i18n("vocabulary.detail.files.file")}</th>
                        <th>{i18n("description")}</th>
                        <th className="pull-right">{i18n("actions")}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows}
                    </tbody>
                </Table>
            </div>
        } else {
            return (null);
        }
    }
}

export default connect((state: TermItState) => {
    return {
        vocabulary: state.vocabulary
    };
}, (dispatch: ThunkDispatch) => {
    return {
        startFileTextAnalysis: (file: File) => dispatch(startFileTextAnalysis(file))
    };
})(injectIntl(withI18n(FileList)));
