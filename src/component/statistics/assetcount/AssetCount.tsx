import * as React from "react";
import SparqlWidget from "../SparqlWidget";
import LD from "ld-query";
import queryTemplate from "./AssetCount.rq";
import VocabularyUtils from "../../../util/VocabularyUtils";

interface Props {
    typeIri : string;
    title : string
}

export default class AssetCount extends React.Component<Props> {
    public render() {
        const query = queryTemplate.split("?assetType").join("<"+this.props.typeIri+">");

        const context = LD( { "termit": VocabularyUtils.NS_TERMIT } );
        const componentFunction = (queryResult : any) =>
            <h2>{ context( queryResult ).query("termit:has-count @value") }</h2>;

        return <SparqlWidget
                title={this.props.title}
                componentFunction={componentFunction}
                sparqlQuery={query}/>;
    }
}