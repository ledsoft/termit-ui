import OntologicalVocabulary from "../util/VocabularyUtils";
import {default as Asset, AssetData} from "./Asset";

const ctx = {
    iri: '@id',
    label: "http://www.w3.org/2000/01/rdf-schema#label",
    comment: "http://www.w3.org/2000/01/rdf-schema#comment",
    subTerms: "http://www.w3.org/2004/02/skos/core#narrower",
    sources: "http://purl.org/dc/elements/1.1/source",
    types: "@type",
};

export const CONTEXT = Object.assign(ctx);

export interface TermData extends AssetData {
    label : string;
    comment?: string;
    subTerms?: string[];
    sources?: string[];
    types?: string[];
    parent?: string;
}

export default class Term extends Asset implements TermData {
    public comment?: string;
    public subTerms?: string[];
    public parent?: string;
    public types?: string[];
    public sources?: string[];

    constructor(termData: TermData) {
        super();
        Object.assign(this, termData);
        if (Array.isArray(termData.types)) {
            const current : string[] = [];
            termData.types.filter(td=> td !== OntologicalVocabulary.TERM)
                .forEach( td => current.push(td) )
            this.types = current;
        }
    }

    public toTermData(): TermData {
        const result : any = {};
        Object.assign(result, this, {
            types: [...this.types || [], OntologicalVocabulary.TERM]
        });
        return result;
    }

    public toJsonLd(): {} {
        const termData = this.toTermData();
        Object.assign(termData, {"@context": CONTEXT});
        return termData;
    }
}