import OntologicalVocabulary from "../util/VocabularyUtils";
import {AssetData, default as Asset} from "./Asset";
import Utils from "../util/Utils";

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
    label: string;
    comment?: string;
    subTerms?: AssetData[];
    sources?: string[];
    types?: string[];
    parent?: string;
    plainSubTerms?: string[];   // Introduced in order to support the Intelligent Tree Select component
}

export default class Term extends Asset implements TermData {
    public comment?: string;
    public subTerms?: AssetData[];
    public parent?: string;
    public types?: string[];
    public sources?: string[];
    public plainSubTerms?: string[];

    constructor(termData: TermData) {
        super();
        Object.assign(this, termData);
        const dataTypes = Utils.sanitizeArray(termData.types);
        this.types = dataTypes.filter(t => t !== OntologicalVocabulary.TERM);
        if (this.subTerms) {
            this.subTerms = Utils.sanitizeArray(this.subTerms);
            this.plainSubTerms = Utils.sanitizeArray(this.subTerms).map(st => st.iri!);
        }
    }

    public toTermData(): TermData {
        const result: any = {};
        Object.assign(result, this, {
            types: [...this.types || [], OntologicalVocabulary.TERM]
        });
        delete result.plainSubTerms;
        return result;
    }

    public toJsonLd(): TermData {
        const termData = this.toTermData();
        Object.assign(termData, {"@context": CONTEXT});
        return termData;
    }
}