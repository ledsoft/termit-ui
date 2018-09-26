import Vocabulary from "../util/Vocabulary";

export const CONTEXT = {
    "iri": "@id",
    "label": "http://www.w3.org/2000/01/rdf-schema#label",
    "vocabulary": "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/je-pojmem-ze-slovniku",
    "types": "@type"
};

export interface SearchResultData {
    iri: string;
    label: string;
    match?: string;
    types: string[];
    vocabulary?: { iri: string };
}

export default class SearchResult {
    private readonly mIri: string;
    private readonly mLabel: string;
    private readonly mMatch?: string;
    private readonly mTypes: string[];
    private readonly mVocabularyIri?: string;

    constructor(data: SearchResultData) {
        this.mIri = data.iri;
        this.mLabel = data.label;
        this.mMatch = data.match;
        this.mTypes = data.types;
        this.mVocabularyIri = data.vocabulary ? data.vocabulary.iri : undefined;
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

    public get typeNameId(): string {
        if (this.mTypes.indexOf(Vocabulary.VOCABULARY) !== -1) {
            return 'type.vocabulary';
        } else if (this.mTypes.indexOf(Vocabulary.TERM) !== -1) {
            return 'type.term';
        } else {
            return '';
        }
    }

    public hasType(type: string): boolean {
        return this.mTypes.indexOf(type) !== -1;
    }
}