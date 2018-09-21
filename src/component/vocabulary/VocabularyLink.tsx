import * as React from 'react';
import Vocabulary from "../../model/Vocabulary";
import {Link} from "react-router-dom";

interface VocabularyLinkProps {
    vocabulary: Vocabulary
}

export default (props : VocabularyLinkProps) => <div>
    <Link to={"/vocabulary/" + props.vocabulary.iri.substring(props.vocabulary.iri.lastIndexOf("/")+1)}>
        {props.vocabulary.name}
    </Link>
</div>
