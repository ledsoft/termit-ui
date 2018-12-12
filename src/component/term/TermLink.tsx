import * as React from "react";
import AssetLink from "../misc/AssetLink";
import Term from "../../model/Term";
import IRI from "../../util/VocabularyUtils";
import {HasI18n} from "../hoc/withI18n";
import {injectIntl} from "react-intl";
import withI18n from "../hoc/withI18n";

interface TermLinkProps extends HasI18n {
    term: Term
}

export const TermLink: React.SFC<TermLinkProps> = (props) => {
    const iri = IRI.create(props.term.vocabulary!.iri!);
    return <AssetLink
        asset={props.term}
        assetContextPath={`/vocabularies/${iri.fragment}/terms`}
        namespace={iri.namespace}
        tooltip={props.i18n("search.results.item.term.tooltip")}/>
}

export default injectIntl(withI18n(TermLink));