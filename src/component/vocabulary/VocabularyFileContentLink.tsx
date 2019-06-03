import * as React from "react";
import {injectIntl} from "react-intl";
import File from "../../model/File";
import VocabularyUtils from "../../util/VocabularyUtils";
import Routes from "../../util/Routes";
import Vocabulary from "../../model/Vocabulary";
import {Link} from "react-router-dom";
import {GoFile} from "react-icons/go";
import withI18n, {HasI18n} from "../hoc/withI18n";

interface VocabularyFileContentLinkProps extends HasI18n {
    file: File;
    vocabulary: Vocabulary;
}

const VocabularyFileContentLink:React.FC<VocabularyFileContentLinkProps> = (props: VocabularyFileContentLinkProps) => {
    const vocabularyIri = VocabularyUtils.create(props.vocabulary.iri);
    const iri = VocabularyUtils.create(props.file.iri);
    const params = {name: vocabularyIri.fragment, fileName: iri.fragment};
    const query = {namespace: vocabularyIri.namespace, fileNamespace: iri.namespace};
    return <Link className="btn btn-primary btn-sm" title={props.i18n("resource.metadata.file.content.view.tooltip")}
                 to={Routes.annotateVocabularyFile.link(params, query)}><GoFile/>&nbsp;{props.i18n("resource.metadata.file.content")}
    </Link>;
};

export default injectIntl(withI18n(VocabularyFileContentLink));
