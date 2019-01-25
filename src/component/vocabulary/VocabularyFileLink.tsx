import * as React from "react";
import AssetLink from "../misc/AssetLink";
import Resource from "../../model/Resource";
import VocabularyUtils from "../../util/VocabularyUtils";
import {Routing} from "../../util/Routing";
import Routes from "../../util/Routes";
import Vocabulary from "../../model/Vocabulary";

interface VocabularyFileLinkProps {
    resource: Resource,
    vocabulary: Vocabulary
}

export default (props: VocabularyFileLinkProps) => {
    const vocabularyIri = VocabularyUtils.create(props.vocabulary.iri);
    const iri = VocabularyUtils.create(props.resource.iri);
    const path = Routing.getTransitionPath(Routes.annotateVocabularyFile,
        {
            params: new Map([["name", vocabularyIri.fragment!], ["fileName", iri.fragment]]),
            query: new Map([["namespace", vocabularyIri.namespace!], ["fileNamespace", iri.namespace!]])
        });
    return <AssetLink
        asset={props.resource}
        path={path}/>;
}
