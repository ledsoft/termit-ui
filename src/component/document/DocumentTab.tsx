import * as React from 'react';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {injectIntl} from "react-intl";
import Tabs from "../misc/Tabs";
import Vocabulary from "../../model/Vocabulary";
import DocumentDetail from "./DocumentDetail";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {ThunkDispatch} from "redux-thunk";
import {Action} from "redux";
import IRIFactory, {IRI} from "../../util/Vocabulary";
import {loadVocabulary} from "../../action/ComplexActions";

interface DocumentTabProps extends HasI18n {
    vocabulary: Vocabulary
}

class DocumentTab extends React.Component<DocumentTabProps> {

    constructor(props: DocumentTabProps) {
        super(props);
    }

    private getActiveTab() {
        return 'vocabulary.detail.tabs.annotations';
    }

    public render() {

        const select = ( id : string ) => {id.toString()};
        const tabs = {};
        if (this.props.vocabulary.document !== null) {
            const documentIRI =  IRIFactory.create(this.props.vocabulary.document!.iri);
            tabs['vocabulary.detail.tabs.annotations'] = () => <DocumentDetail iri={documentIRI}/>;
        }
        return <div>
        <Tabs
            activeTabLabelKey={this.getActiveTab()}
            tabs={ tabs }
            changeTab={select}
        />
        </div>
    }
}

export default connect((state: TermItState) => {
    return {
        vocabulary: state.vocabulary
    };
}, (dispatch: ThunkDispatch<object, undefined, Action>) => {
    return {
        loadVocabulary: (iri: IRI) => dispatch(loadVocabulary(iri))
    };
})(injectIntl(withI18n(DocumentTab)));