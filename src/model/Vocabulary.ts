import User from "./User";

export const CONTEXT = {
    "name": "http://www.w3.org/2000/01/rdf-schema#label",
    "iri": "@id"
};

export interface VocabularyData {
    name: string,
    iri?: string,
    author?: User
}

export default class Vocabulary implements VocabularyData {
    public name: string;
    public iri?: string;
    public author?: User;

    constructor(data: VocabularyData) {
        Object.assign(this, data);
    }

    public toJsonLd(): {} {
        return Object.assign({}, this, {"@context": CONTEXT});
    }
}

export const EMPTY_VOCABULARY = new Vocabulary({
    iri: 'http://empty',
    name: ''
});