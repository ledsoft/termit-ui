import * as React from "react";
import File from "../../model/File";
import {Link} from "react-router-dom";
import VocabularyUtils from "../../util/VocabularyUtils";

interface FileLinkProps {
    file: File
}

export default (props : FileLinkProps) => {
    const iri = VocabularyUtils.create(props.file.iri);
    return <div>
        <Link to={"/file/" + iri.fragment + "?namespace=" + iri.namespace}>
            {props.file.label}
        </Link>
    </div>;
}
