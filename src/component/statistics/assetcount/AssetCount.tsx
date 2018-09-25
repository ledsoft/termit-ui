import * as React from "react";
import SparqlWidget from "../SparqlWidget";
import LD from "ld-query";
import queryTemplate from "./AssetCount.rq";

interface Props {
    typeIri : string;
    title : string
}

export class AssetCount extends React.Component<Props> {
    public render() {
        const query = queryTemplate.split('?assetType').join('<'+this.props.typeIri+'>');

        const context = LD( { "termit": 'http://onto.fel.cvut.cz/ontologies/termit/' } );
        const componentFunction = (queryResult : any) =>
            <h2>{ context( queryResult ).query("termit:has-count @value") }</h2>;

        return (<div>
            <SparqlWidget
                title={this.props.title}
                componentFunction={componentFunction}
                sparqlQuery={query}/>
        </div>);
    }
}

export default AssetCount;