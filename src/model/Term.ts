import OntologicalVocabulary from "../util/VocabularyUtils";
import {default as Asset, AssetData} from "./Asset";

const ctx = {
    iri: '@id',
    label: "http://www.w3.org/2000/01/rdf-schema#label",
    comment: "http://www.w3.org/2000/01/rdf-schema#comment",
    subTerms: "http://www.w3.org/2004/02/skos/core#narrower",
    sources: "http://purl.org/dc/elements/1.1/source",
    type: "@type",
};

export const CONTEXT = Object.assign(ctx);

export interface TermData extends AssetData {
    label : string;
    comment?: string;
    subTerms?: string[];
    parent?: string;
    types?: string[];
    sources?: string[];
}

export default class Term extends Asset implements TermData {
    public label : string;
    public comment?: string;
    public subTerms?: string[];
    public parent?:string;
    public types?: string[];
    public sources?: string[];

    constructor(data: TermData) {
        super();
        Object.assign(this, data);
    }

    public toJsonLd(): {} {
        return Object.assign({}, this, {"@context": CONTEXT, "@type": [OntologicalVocabulary.TERM]});
    }
}