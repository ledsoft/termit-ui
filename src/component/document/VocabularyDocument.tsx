import * as React from 'react';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {injectIntl} from "react-intl";
import Vocabulary from "../../model/Vocabulary";
import DocumentDetail from "./DocumentDetail";
import IRIFactory from "../../util/VocabularyUtils";

interface VocabularyDocumentProps extends HasI18n {
    vocabulary: Vocabulary
}

const VocabularyDocument: React.SFC<VocabularyDocumentProps> = (props: VocabularyDocumentProps) => {
    if (props.vocabulary.document) {
        const documentIRI = IRIFactory.create(props.vocabulary.document!.iri);
        return <div>
            <hr/>
            <h5>{props.i18n('vocabulary.detail.files')}</h5>
            <DocumentDetail iri={documentIRI}/>
        </div>;
    } else {
        return null;
    }
};

export default injectIntl(withI18n(VocabularyDocument));