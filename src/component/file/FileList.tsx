import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Button, ButtonToolbar, Table} from "reactstrap";
import File from "../../model/File";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {ThunkDispatch} from "../../util/Types";
import {executeFileTextAnalysis} from "../../action/AsyncActions";
import Vocabulary, {EMPTY_VOCABULARY} from "../../model/Vocabulary";
import {GoClippy} from "react-icons/go";
import withInjectableLoading, {InjectsLoading} from "../hoc/withInjectableLoading";
import ResourceLink from "../resource/ResourceLink";
import VocabularyFileContentLink from "../vocabulary/VocabularyFileContentLink";
import Utils from "../../util/Utils";


interface FileListProps extends HasI18n {
    vocabulary: Vocabulary,
    files: File[],
    executeFileTextAnalysis: (file: File) => Promise<any>
}

interface ButtonProps extends HasI18n {
    onClick: () => Promise<any>
}

class ButtonWithInjectableLoading extends React.Component<InjectsLoading & ButtonProps> {

    constructor(props: InjectsLoading & ButtonProps) {
        super(props);
    }

    private onClickWithLoading = () => {
        this.props.loadingOn();
        const loadingOffFunc = () => {
            this.props.loadingOff();
        };
        const p = this.props.onClick();
        if (p) {
            p.then(
                () => loadingOffFunc(),
                () => loadingOffFunc()
            );
        }
    };

    public render() {
        const i18n = this.props.i18n;
        const icon = <GoClippy/>;
        return <Button className="link-to-resource" size="sm" color="primary"
                       title={i18n("file.metadata.startTextAnalysis")}
                       onClick={this.onClickWithLoading}> {icon} {i18n("file.metadata.startTextAnalysis.text")}
        </Button>;
    }
}

export class FileList extends React.Component<FileListProps> {

    private fileTextAnalysisCallback = (file: File) => {
        return () => this.props.executeFileTextAnalysis(file);
    };

    public render() {
        const ButtonWithLoading = withInjectableLoading(injectIntl(withI18n(ButtonWithInjectableLoading)));

        if (this.props.files.length > 0 && (this.props.vocabulary !== EMPTY_VOCABULARY)) {
            const rows = this.props.files.slice().sort(Utils.labelComparator).map((v: File) =>
                <tr key={v.iri}>
                    <td className="align-middle">
                        <ResourceLink resource={v}/>
                    </td>
                    <td className="pull-right">
                        <ButtonToolbar>
                            <VocabularyFileContentLink file={v} vocabulary={this.props.vocabulary}/>
                            <ButtonWithLoading onClick={this.fileTextAnalysisCallback(v)}/>
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
    return {
        intl: state.intl,
        vocabulary: state.vocabulary
    };
}, (dispatch: ThunkDispatch) => {
    return {
        executeFileTextAnalysis: (file: File) => dispatch(executeFileTextAnalysis(file))
    };
})(injectIntl(withI18n(FileList)));
