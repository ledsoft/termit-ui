import OntologicalVocabulary from '../util/VocabularyUtils';

const ctx = {
    "iri": "@id",
    "fileName": "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/ma-nazev-souboru",
    "comment": "http://www.w3.org/2000/01/rdf-schema#comment",
    "content": "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/soubor/content"
};

export const CONTEXT = ctx;

export interface FileData {
    iri?: string,
    fileName: string,
    comment?: string,
    origin?: string,
    content?: string
}

export default class File implements FileData {
    public iri: string;
    public fileName: string;
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
    fileName: ''
});