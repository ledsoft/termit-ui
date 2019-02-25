import * as React from "react";
import Vocabulary from "../../model/Vocabulary";
import AssetLink from "../misc/AssetLink";
import VocabularyUtils from "../../util/VocabularyUtils";
import {Routing} from "../../util/Routing";
import Routes from "../../util/Routes";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";

interface VocabularyLinkProps extends HasI18n {
    vocabulary: Vocabulary;
    id?: string;
}

export const VocabularyLink = (props: VocabularyLinkProps) => {
    const iri = VocabularyUtils.create(props.vocabulary.iri);
    const path = Routing.getTransitionPath(Routes.vocabularySummary,
        {
            params: new Map([["name", iri.fragment]]),
            query: new Map([["namespace", iri.namespace!]])
        });
    return <AssetLink id={props.id}
                      asset={props.vocabulary}
                      path={path}
                      tooltip={props.i18n("asset.link.tooltip")}/>;
};

export default injectIntl(withI18n(VocabularyLink));