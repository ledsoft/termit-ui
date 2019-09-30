import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../../hoc/withI18n";
import File from "../../../model/File";
import VocabularyUtils from "../../../util/VocabularyUtils";
import {Link} from "react-router-dom";
import Routes from "../../../util/Routes";
import {GoFile} from "react-icons/go";

interface FileContentLinkProps extends HasI18n {
    file: File;
}

const FileContentLink: React.FC<FileContentLinkProps> = props => {
    const iri = VocabularyUtils.create(props.file.iri);
    const params = {name: iri.fragment};
    const query = {namespace: iri.namespace};
    return <Link className="btn btn-primary btn-sm" title={props.i18n("resource.metadata.file.content.view.tooltip")}
                 to={Routes.annotateFile.link(params, query)}><GoFile/>&nbsp;{props.i18n("resource.metadata.file.content")}
    </Link>;
};

export default injectIntl(withI18n(FileContentLink));
