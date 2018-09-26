import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from '../hoc/withI18n';
import FileList from "../file/FileList";
import TermItState from "../../model/TermItState";
import {connect} from "react-redux";
import {loadDocument} from "../../action/ComplexActions";
import {IRI} from "../../util/VocabularyUtils";
import Document from "../../model/Document";
import {ThunkDispatch} from '../../util/Types';


interface DocumentDetailProps extends HasI18n {
    iri: IRI, // TODO remove
    document: Document,
    loadDocument: (iri: IRI) => void
}

class DocumentDetail extends React.Component<DocumentDetailProps> {

    public componentDidMount() {
        this.props.loadDocument(this.props.iri);
    }

    public render() {
        return <div>
            {(this.props.document.files.length > 0) ? <FileList files={this.props.document.files}/> : (null)}
        </div>
    }
}


export default connect((state: TermItState) => {
    return {
        document: state.document
    };
}, (dispatch: ThunkDispatch) => {
    return {
        loadDocument: (iri: IRI) => dispatch(loadDocument(iri))
    };
})(injectIntl(withI18n(DocumentDetail)));