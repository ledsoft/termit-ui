import * as React from "react";
import Vocabulary from "../../model/Vocabulary";
import AssetLink from "../misc/AssetLink";
import VocabularyUtils from "../../util/VocabularyUtils";
import {Routing} from "../../util/Routing";
import Routes from "../../util/Routes";

interface VocabularyLinkProps {
    vocabulary: Vocabulary
}

export default (props: VocabularyLinkProps) => {
    const iri = VocabularyUtils.create(props.vocabulary.iri);
    const path = Routing.getTransitionPath(Routes.vocabularySummary,
        {
            params: new Map([["name", iri.fragment]]),
            query: new Map([["namespace", iri.namespace!]])
        });
    return <AssetLink
        asset={props.vocabulary}
        path={path}/>;
}