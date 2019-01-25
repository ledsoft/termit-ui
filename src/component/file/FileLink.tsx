import * as React from "react";
import AssetLink from "../misc/AssetLink";
import Resource from "../../model/Resource";
import VocabularyUtils from "../../util/VocabularyUtils";
import {Routing} from "../../util/Routing";
import Routes from "../../util/Routes";

interface ResourceLinkProps {
    resource: Resource
}

export default (props: ResourceLinkProps) => {
    const iri = VocabularyUtils.create(props.resource.iri);
    const path = Routing.getTransitionPath(Routes.annotateFile,
        {
            params: new Map([["name", iri.fragment]]),
            query: new Map([["namespace", iri.namespace!]])
        });
    return <AssetLink
        asset={props.resource}
        path={path}/>;
}
