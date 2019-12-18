import * as React from "react";
import VocabularyUtils from "../../util/VocabularyUtils";
import {Routing} from "../../util/Routing";
import Routes from "../../util/Routes";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import AssetIriLink from "../misc/AssetIriLink";

interface VocabularyIriLinkProps extends HasI18n {
    iri: string;
    id?: string;
}

/**
 * Link to a Vocabulary detail for situation when Vocabulary label is not available and only IRI is known.
 *
 * The link will fetch the corresponding label and display it.
 */
const VocabularyIriLink: React.FC<VocabularyIriLinkProps> = (props: VocabularyIriLinkProps) => {
    const iri = VocabularyUtils.create(props.iri);
    const path = Routing.getTransitionPath(Routes.vocabularySummary,
        {
            params: new Map([["name", iri.fragment]]),
            query: new Map([["namespace", iri.namespace!]])
        });
    return <AssetIriLink assetIri={iri.toString()} path={path} tooltip={props.i18n("asset.link.tooltip")}/>;
};

export default injectIntl(withI18n(VocabularyIriLink));
