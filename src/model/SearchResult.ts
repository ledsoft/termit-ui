import Vocabulary from "../util/VocabularyUtils";
import {AssetData} from "./Asset";
import VocabularyUtils from "../util/VocabularyUtils";

export const CONTEXT = {
    "iri": "@id",
    "label": VocabularyUtils.RDFS_LABEL,
    "vocabulary": VocabularyUtils.JE_POJMEM_ZE_SLOVNIKU,
    "snippetText": "http://onto.fel.cvut.cz/ontologies/application/termit/slovník/fts/snippet-text",
    "snippetField": "http://onto.fel.cvut.cz/ontologies/application/termit/slovník/fts/snippet-field",
    "score": "http://onto.fel.cvut.cz/ontologies/application/termit/slovník/fts/score",
    "types": "@type"
};

export interface SearchResultData extends AssetData {
    iri: string;
    label: string;
    snippetText: string;
    snippetField: string;
    score?: number;
    types: string[];
    vocabulary?: { iri: string };
}

export default class SearchResult implements AssetData {
    public readonly iri: string;
    public readonly label: string;
    public readonly snippetText: string;
    public readonly snippetField: string;
    public readonly score?: number;
    public readonly types: string[];
    public readonly vocabulary?: { iri: string };

    constructor(data: SearchResultData) {
        Object.assign(this, data);
    }

    public copy(): SearchResult {
        return new SearchResult(Object.assign({}, this));
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