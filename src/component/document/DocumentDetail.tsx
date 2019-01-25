import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import FileList from "../file/FileList";
import {connect} from "react-redux";
import {loadDocument} from "../../action/AsyncActions";
import {IRI} from "../../util/VocabularyUtils";
import Document from "../../model/Document";
import {ThunkDispatch} from "../../util/Types";
import TermItState from "../../model/TermItState";


interface DocumentDetailOwnProps {
    iri: IRI, // TODO remove
    document: Document,
}

interface DocumentDetailDispatchProps {
    loadDocument: (iri: IRI) => void
}

type DocumentDetailProps = DocumentDetailOwnProps & DocumentDetailDispatchProps & HasI18n;

export class DocumentDetail extends React.Component<DocumentDetailProps> {

    public componentDidMount(): void {
        this.synchronizeDocument();
    }

    public componentDidUpdate(): void {
        this.synchronizeDocument();
    }

    private synchronizeDocument(): void {
        if (DocumentDetail.isDifferent(this.props.iri,this.props.document.iri)) {
            this.props.loadDocument(this.props.iri);
        }
    }

    public render() {
        return <FileList files={this.props.document.files}/>;
    }

    private static isDifferent(iri1: IRI, iri2: string): boolean {
        const iri1str = iri1.namespace + iri1.fragment;
        return iri1str !== iri2;
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