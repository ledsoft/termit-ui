import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from '../hoc/withI18n';
import {Table} from "reactstrap";
import FileLink from "./FileLink";
import File from "../../model/File";

interface FileListProps extends HasI18n {
    files: File[]
}

export class FileList extends React.Component<FileListProps> {

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

export default injectIntl(withI18n(FileList));