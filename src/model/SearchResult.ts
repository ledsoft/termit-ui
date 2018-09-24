export const CONTEXT = {
    "iri": "@id",
    "label": "http://www.w3.org/2000/01/rdf-schema#label",
    "vocabularyIri": "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/je-pojmem-ze-slovniku",
    "types": "@type"
};

export interface SearchResultData {
    iri: string;
    label: string;
    match?: string;
    types: string[];
    vocabularyIri?: string;
}

export default class SearchResult {
    private readonly mIri: string;
    private readonly mLabel: string;
    private readonly mMatch?: string;
    private readonly mTypes: string[];
    private readonly mVocabularyIri?: string;

    constructor(data:SearchResultData) {
        this.mIri = data.iri;
        this.mLabel = data.label;
        this.mMatch = data.match;
        this.mTypes = data.types;
        this.mVocabularyIri = data.vocabularyIri;
    }

    public get iri(): string {
        return this.mIri;
    }

    public get label(): string {
        return this.mLabel;
    }

    public get match(): string | undefined {
        return this.mMatch;
    }

    public get types(): string[] {
        return this.mTypes;
    }

    public get vocabularyIri(): string | undefined {
        return this.mVocabularyIri;
    }
}