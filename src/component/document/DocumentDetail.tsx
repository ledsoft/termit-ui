import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from '../hoc/withI18n';
import FileList from "../file/FileList";
import {connect} from "react-redux";
import {loadDocument} from "../../action/ComplexActions";
import {IRI} from "../../util/VocabularyUtils";
import Document from "../../model/Document";
import {ThunkDispatch} from '../../util/Types';
import TermItState from "../../model/TermItState";


interface DocumentDetailOwnProps {
    document: Document,
    iri: IRI, // TODO remove
}

interface DocumentDetailDispatchProps {
    loadDocument: (iri: IRI) => void
}

type DocumentDetailProps = DocumentDetailOwnProps & DocumentDetailDispatchProps & HasI18n;

export class DocumentDetail extends React.Component<DocumentDetailProps> {

    public componentDidMount() {
        this.props.loadDocument(this.props.iri);
    }

    public render() {
        return <FileList files={this.props.document.files}/>;
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