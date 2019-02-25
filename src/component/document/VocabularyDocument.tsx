import * as React from "react";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {injectIntl} from "react-intl";
import Vocabulary from "../../model/Vocabulary";
import FileList from "../file/FileList";

interface VocabularyDocumentProps extends HasI18n {
    vocabulary: Vocabulary
}

const VocabularyDocument: React.SFC<VocabularyDocumentProps> = (props: VocabularyDocumentProps) => {
    if (props.vocabulary.document && props.vocabulary.document.files) {
        return <div>
            <hr/>
            <h5>{props.i18n("vocabulary.detail.files")}</h5>
            <FileList files={props.vocabulary.document!.files}/>
        </div>;
    } else {
        return null;
    }
};

export default injectIntl(withI18n(VocabularyDocument));