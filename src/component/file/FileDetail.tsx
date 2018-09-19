import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from '../hoc/withI18n';
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {loadFile} from "../../action/ComplexActions";
import {ThunkDispatch} from "redux-thunk";
import {Action} from "redux";
import File from "../../model/File";
import {Parser} from 'html-to-react';

interface FileDetailProps extends HasI18n { // RouteComponentProps<any> {
    file: File,
    loadFile: (normalizedName: string) => void
}

class FileDetail extends React.Component<FileDetailProps> {

    public componentDidMount(): void {
        const normalizedName = 'metropolitan-plan-p1.html'; // this.props.match.params.name; //TODO remove
        this.props.loadFile(normalizedName);
    }

    public render() {
        const htmlToReactParser = new Parser();
        const reactElement = htmlToReactParser.parse(this.props.file.content);
        return <div>
            {reactElement}
        </div>
    }
}

export default connect((state: TermItState) => {
    return {
        file: state.file
    };
}, (dispatch: ThunkDispatch<object, undefined, Action>) => {
    return {
        loadFile: (normalizedName: string) => dispatch(loadFile(normalizedName))
    };
})(injectIntl(withI18n(FileDetail)));