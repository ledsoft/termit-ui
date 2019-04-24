import OntologicalVocabulary from "../util/VocabularyUtils";
import Resource, {CONTEXT as RESOURCE_CONTEXT, ResourceData} from "./Resource"
import {OWN_CONTEXT as DOCUMENT_CONTEXT, DocumentData} from "./Document";

const ctx = {
    "content": "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/soubor/content",
    "owner": "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/je-částí-dokumentu"
};

export const CONTEXT = Object.assign({}, RESOURCE_CONTEXT, ctx, DOCUMENT_CONTEXT);

export interface FileData extends ResourceData {
    origin?: string,
    content?: string;
    owner?: DocumentData;
}

export default class File extends Resource implements FileData {
    public origin: string;
    public content?: string;
    public owner?: DocumentData;

    constructor(data: FileData) {
        super(data);
        this.origin = data.origin ? data.origin : "";
        this.content = data.content;
        this.owner = data.owner;
    }

    public clone() {
        return new File(this);
    }

    public toJsonLd(): {} {
        return Object.assign({}, this, {"@context": RESOURCE_CONTEXT, "@type": [OntologicalVocabulary.FILE]});
    }
}

export const EMPTY_FILE = new File({
    iri: "http://empty",
    label: "",
    terms: []
});