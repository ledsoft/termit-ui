import * as React from "react";
import SparqlWidget from "./SparqlWidget";

interface Props {
    typeIri : string;
    title : string
}

export class AssetCount extends React.Component<Props> {
    public render() {
        const vTermitBase = 'http://onto.fel.cvut.cz/ontologies/termit/';
        // const vocHasCount = vTermitBase+'has-count';
        const prefixes = 'PREFIX termit: <'+vTermitBase+'>\n';
        const queryTemplate = prefixes + 'CONSTRUCT {?assetType termit:has-count ?count} WHERE { SELECT COUNT(*) AS ?count {?asset a ?assetType}}';
        const query = queryTemplate.replace('?assetType','<'+this.props.typeIri+'>');
        const componentFunction = (queryResult : any) => <div>{JSON.stringify(queryResult)}</div>;
        return (<div>
            <SparqlWidget
                title={this.props.title}
                componentFunction={componentFunction}
                sparqlQuery={query}/>
        </div>);
    }
}

export default AssetCount;