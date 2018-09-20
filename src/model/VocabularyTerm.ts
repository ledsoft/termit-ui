import OntologicalVocabulary from "../util/Vocabulary";

const ctx = {
    iri: '@id',
    label: "http://www.w3.org/2000/01/rdf-schema#label",
    description: "http://www.w3.org/2000/01/rdf-schema#comment",
    subTerms: "http://www.w3.org/2004/02/skos/core#narrower",
    // TODO impement
};

export const CONTEXT = Object.assign(ctx);

export interface VocabularyTermData {
    label: string;
    comment?: string;
    iri: string;
    subTerms?: string[];
    parent?: string;
    types?: string[]
}

export default class VocabularyTerm implements VocabularyTermData {
    public label: string;
    public comment?: string;
    public iri: string;
    public subTerms?: string[];
    public parent?: string;
    public types?: string[];

    constructor(data: VocabularyTermData) {
        Object.assign(this, data);
    }

    public toJsonLd(): {} {
        return Object.assign({}, this, {"@context": CONTEXT, "@type": [OntologicalVocabulary.TERM]});
    }
}