import * as React from 'react';
import Vocabulary2 from "../../util/VocabularyUtils";
import {Link} from "react-router-dom";
import Asset from "../../model/Asset";
import OutgoingLink from "./OutgoingLink";

interface AssetLinkProps<T extends Asset> {
    asset: T,
    assetContextPath: string
}

export default <T extends Asset>(props: AssetLinkProps<T>) => {
    const {fragment, namespace} = Vocabulary2.create(props.asset.iri);
    return <OutgoingLink label=
                             {<Link
                                 to={props.assetContextPath + "/" + fragment + (namespace ? "?namespace=" + namespace : "")}>
                                 {props.asset.label}
                             </Link>}
                         iri={props.asset.iri}/>
}
