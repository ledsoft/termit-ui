import Vocabulary from "../util/VocabularyUtils";

export const CONTEXT = {
    "iri": "@id",
    "label": "http://www.w3.org/2000/01/rdf-schema#label",
    "vocabulary": "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/je-pojmem-ze-slovniku",
    "snippetText": "http://onto.fel.cvut.cz/ontologies/application/termit/fts/snippet-text",
    "snippetField": "http://onto.fel.cvut.cz/ontologies/application/termit/fts/snippet-field",
    "score": "http://onto.fel.cvut.cz/ontologies/application/termit/fts/score",
    "types": "@type"
};

export interface SearchResultData {
    iri: string;
    label: string;
    snippetText: string;
    snippetField?: string;
    score?: number;
    types: string[];
    vocabulary?: { iri: string };
}

export default class SearchResult {
    public readonly iri: string;
    public readonly label: string;
    public readonly snippetText: string;
    public readonly snippetField?: string;
    public readonly score?: number;
    public readonly types: string[];
    public readonly vocabulary?: string;

    constructor(data: SearchResultData) {
        Object.assign(this, data);
        this.vocabulary = data.vocabulary ? data.vocabulary.iri: undefined;
    }

    public get typeNameId(): string {
        if (this.hasType(Vocabulary.VOCABULARY)) {
            return "type.vocabulary";
        } else if (this.hasType(Vocabulary.TERM)) {
            return "type.term";
        } else {
            return "";
        }
    }

    public hasType(type: string): boolean {
        return this.types && this.types.indexOf(type) !== -1;
    }
}