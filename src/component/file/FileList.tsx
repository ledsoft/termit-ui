import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from '../hoc/withI18n';
import {Button, Table} from "reactstrap";
import FileLink from "./FileLink";
import File from "../../model/File";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {ThunkDispatch} from "../../util/Types";
import {IRI} from "../../util/VocabularyUtils";
import {startFileTextAnalysis} from "../../action/AsyncActions";
import {GoClippy} from "react-icons/go";


interface FileListProps extends HasI18n {
    documentIri: IRI,
    files: File[],
    startFileTextAnalysis: (documentIri: IRI, name: string) => void
}

export class FileList extends React.Component<FileListProps> {

    private fileTextAnalysisCallback = (name: string) => {
        return () => this.props.startFileTextAnalysis(this.props.documentIri, name);
    };

    public render() {
        const i18n = this.props.i18n;
        if (this.props.files.length > 0) {
            const rows = this.props.files.map(v =>
                <tr key={v.iri}>
                    <td className='align-middle'>
                        <FileLink file={v}/>
                    </td>
                    <td className='align-middle'>
                        {v.comment}
                    </td>
                    <td className="pull-right">
                        <Button className="link-to-resource" size='sm' color='info'
                                title={i18n('file.metadata.startTextAnalysis')}
                                onClick={this.fileTextAnalysisCallback(v.name)}><GoClippy/></Button>
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
    return {};
}, (dispatch: ThunkDispatch) => {
    return {
        startFileTextAnalysis: (documentIri: IRI, name: string) => dispatch(startFileTextAnalysis(documentIri, name))
    };
})(injectIntl(withI18n(FileList)));
