import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {ButtonToolbar, Table} from "reactstrap";
import File from "../../model/File";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import ResourceLink from "../resource/ResourceLink";
import Utils from "../../util/Utils";
import TextAnalysisInvocationButton from "../resource/file/TextAnalysisInvocationButton";
import FileContentLink from "../resource/file/FileContentLink";


interface FileListProps extends HasI18n {
    files: File[];
}

export const FileList: React.FC<FileListProps> = (props: FileListProps) => {
    if (Utils.sanitizeArray(props.files).length > 0) {
        const rows = props.files.slice().sort(Utils.labelComparator).map((v: File) =>
            <tr key={v.iri}>
                <td className="align-middle">
                    <ResourceLink resource={v}/>
                </td>
                <td className="pull-right">
                    <ButtonToolbar>
                        <FileContentLink file={v}/>
                        <TextAnalysisInvocationButton file={v}/>
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
        return <div id="file-list-empty"
                    className="italics">{props.i18n("resource.metadata.document.files.empty")}</div>;
    }
};

export default connect((state: TermItState) => {
    return {
        intl: state.intl,
        vocabulary: state.vocabulary
    };
})(injectIntl(withI18n(FileList)));
