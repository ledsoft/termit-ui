import User from "./User";
import OntologicalVocabulary from '../util/Vocabulary';

export const CONTEXT = {
    "name": "http://www.w3.org/2000/01/rdf-schema#label",
    "iri": "@id",
    "created": "http://onto.fel.cvut.cz/ontologies/termit/created",
    "author": "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/ma-autora"
};

export interface VocabularyData {
    name: string,
    iri?: string,
    author?: User,
    created?: number
}

export default class Vocabulary implements VocabularyData {
    public name: string;
    public iri?: string;
    public author?: User;
    public created?: number;

    constructor(data: VocabularyData) {
        Object.assign(this, data);
    }

    public toJsonLd(): {} {
        return Object.assign({}, this, {"@context": CONTEXT, "@type": [OntologicalVocabulary.VOCABULARY]});
    }
}

export const EMPTY_VOCABULARY = new Vocabulary({
    iri: 'http://empty',
    name: ''
});