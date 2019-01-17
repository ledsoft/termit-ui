import * as React from "react";
import AssetLink from "../misc/AssetLink";
import Term from "../../model/Term";
import VocabularyUtils from "../../util/VocabularyUtils";
import {HasI18n} from "../hoc/withI18n";
import {injectIntl} from "react-intl";
import withI18n from "../hoc/withI18n";
import {Routing} from "../../util/Routing";
import Routes from "../../util/Routes";
import OutgoingLink from "../misc/OutgoingLink";

interface TermLinkProps extends HasI18n {
    term: Term
}

export const TermLink: React.SFC<TermLinkProps> = (props) => {
    if (!props.term.vocabulary) {
        // This can happen e.g. when FTS returns a term in the predefined language used for term types
        return <OutgoingLink label={props.term.label} iri={props.term.iri}/>;
    }
    const vocIri = VocabularyUtils.create(props.term.vocabulary!.iri!);
    const iri = VocabularyUtils.create(props.term.iri);
    const path = Routing.getTransitionPath(Routes.vocabularyTermDetail,
        {
            params: new Map([["name", vocIri.fragment], ["termName", iri.fragment]]),
            query: new Map([["namespace", vocIri.namespace!]])
        });

    return <AssetLink
        asset={props.term}
        path={path}
        tooltip={props.i18n("asset.link.tooltip")}/>
};

export default injectIntl(withI18n(TermLink));