import OntologicalVocabulary from '../util/Vocabulary';
import File, {CONTEXT as FILE_CONTEXT} from "./File";

const ctx = {
    "iri": "@id",
    "name": "http://www.w3.org/2000/01/rdf-schema#label",
    "description": "http://purl.org/dc/elements/1.1/description",
    "files": {
        "@id": "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/ma-soubor",
        "@container": "@set"
    }
};

export const CONTEXT = Object.assign(ctx, FILE_CONTEXT);

export interface DocumentData {
    iri: string,
    name: string,
    description?: string,
    files: File[],
}

export default class Document implements DocumentData {
    public iri: string;
    public name: string;
    public description: string;
    public files: File[];

    constructor(data: DocumentData) {
        Object.assign(this, data);
    }

    public toJsonLd(): {} {
        return Object.assign({}, this, {"@context": CONTEXT, "@type": [OntologicalVocabulary.DOCUMENT]});
    }
}

export const EMPTY_DOCUMENT = new Document({
    iri: 'http://empty',
    name: '',
    files: []
});


