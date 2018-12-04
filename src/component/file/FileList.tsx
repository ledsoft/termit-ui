import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from '../hoc/withI18n';
import {Button, ButtonToolbar, Table} from "reactstrap";
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
    }

    public render() {
        if (this.props.files.length > 0) {
            const rows = this.props.files.map(v =>
                <tr key={v.iri}>
                    <td>
                        <FileLink file={v}/>
                    </td>
                    <td>
                        {v.comment}
                    </td>
                    <td>
                        <ButtonToolbar className='pull-right clearfix'>
                            <Button size='sm' color='info' title={this.props.i18n('file.metadata.startTextAnalysis')}
                                    onClick={this.fileTextAnalysisCallback(v.name)}><GoClippy/></Button>
                        </ButtonToolbar>
                    </td>
                </tr>
            );
            return <div>
                <Table borderless={true}>
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
