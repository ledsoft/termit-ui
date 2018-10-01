import * as React from 'react';
import AssetLink from "../misc/AssetLink";
import Term from "../../model/Term";
import Vocabulary from "../../model/Vocabulary";
import VocabularyUtils from "../../util/VocabularyUtils";

interface TermLinkProps {
    asset: Term,
    vocabulary : Vocabulary
}

export default (props : TermLinkProps) => {
    const vocIri = VocabularyUtils.create(props.vocabulary.iri);
    const termIri = VocabularyUtils.create(props.asset.iri);
    return ((vocIri.namespace+"/pojem") === termIri.namespace) ?
        <AssetLink asset={props.asset} assetContextPath={"/vocabulary/"+vocIri.fragment+"/term"}/> :
        <div>Invalid term {termIri}</div> ;
}
