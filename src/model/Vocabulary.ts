import User, {UserData, CONTEXT as USER_CONTEXT} from "./User";
import OntologicalVocabulary from '../util/Vocabulary';

const ctx = {
    "name": "http://www.w3.org/2000/01/rdf-schema#label",
    "iri": "@id",
    "created": "http://purl.org/dc/terms/created",
    "author": "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/ma-autora",
    "document": "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/popisuje-dokument"
};

export const CONTEXT = Object.assign(ctx, USER_CONTEXT);

export interface VocabularyData {
    name: string,
    iri?: string,
    author?: UserData,
    created?: number
    document?: { iri: string }
}

export default class Vocabulary implements VocabularyData {
    public name: string;
    public iri: string;
    public author?: User;
    public created?: number;
    public document?: { iri: string };

    constructor(data: VocabularyData) {
        Object.assign(this, data);
        if (data.author) {
            this.author = new User(data.author);
        }
    }

    public toJsonLd(): {} {
        return Object.assign({}, this, {"@context": CONTEXT, "@type": [OntologicalVocabulary.VOCABULARY]});
    }
}

export const EMPTY_VOCABULARY = new Vocabulary({
    iri: 'http://empty',
    name: ''
});