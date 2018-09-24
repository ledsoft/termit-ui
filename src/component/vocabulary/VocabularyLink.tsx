import * as React from 'react';
import Vocabulary from "../../model/Vocabulary";
import Vocabulary2 from "../../util/Vocabulary";
import {Link} from "react-router-dom";
import Constants from "../../util/Constants";

interface VocabularyLinkProps {
    vocabulary: Vocabulary
}

export default (props : VocabularyLinkProps) => {
    const {fragment,namespace} = Vocabulary2.create(props.vocabulary.iri)
    return <div>
        <Link to={"/asset/" + fragment + (namespace===Constants.namespace_vocabulary ? "" : "?namespace="+namespace )}>
            {props.vocabulary.name}
        </Link>
    </div>;
}