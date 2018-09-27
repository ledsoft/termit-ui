import * as React from 'react';
import Vocabulary from "../../model/Vocabulary";
import Vocabulary2 from "../../util/VocabularyUtils";
import {Link} from "react-router-dom";

interface VocabularyLinkProps {
    vocabulary: Vocabulary
}

export default (props : VocabularyLinkProps) => {
    const {fragment,namespace} = Vocabulary2.create(props.vocabulary.iri)
    return <div>
        <Link to={"/vocabulary/" + fragment + (namespace ? "?namespace="+namespace : "")}>
            {props.vocabulary.name}
        </Link>
    </div>;
}