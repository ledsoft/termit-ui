import * as React from "react";
import SparqlWidget from "./SparqlWidget";
import LD from "ld-query";

interface Props {
    typeIri : string;
    title : string
}

export class AssetCount extends React.Component<Props> {
    public render() {
        const vTermitBase = 'http://onto.fel.cvut.cz/ontologies/termit/';
        const prefixes = 'PREFIX termit: <'+vTermitBase+'>\n';
        const queryTemplate = prefixes + 'CONSTRUCT {?assetType termit:has-count ?count} ' +
            'WHERE { SELECT (COUNT(DISTINCT ?asset) AS ?count) {?asset a ?assetType}}';

        const query = queryTemplate.split('?assetType').join('<'+this.props.typeIri+'>');
        const context = LD( { "termit": vTermitBase } );

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