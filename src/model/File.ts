import OntologicalVocabulary from '../util/VocabularyUtils';

const ctx = {
    "iri": "@id",
    "name": "http://www.w3.org/2000/01/rdf-schema#label",
    "comment": "http://www.w3.org/2000/01/rdf-schema#comment",
    "content": "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/soubor/content"
};

export const CONTEXT = ctx;

export interface FileData {
    iri?: string,
    name: string,
    comment?: string,
    origin?: string,
    content?: string
}

export default class File implements FileData {
    public iri: string;
    public name: string;
    public comment: string;
    public origin: string;
    public content?: string;

    constructor(data: FileData) {
        Object.assign(this, data);
    }

    public toJsonLd(): {} {
        return Object.assign({}, this, {"@context": CONTEXT, "@type": [OntologicalVocabulary.FILE]});
    }
}

export const EMPTY_FILE = new File({
    iri: 'http://empty',
    name: ''
});