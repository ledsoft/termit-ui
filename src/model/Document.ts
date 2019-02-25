import OntologicalVocabulary from "../util/VocabularyUtils";
import File, {CONTEXT as FILE_CONTEXT} from "./File";
import Resource, {CONTEXT as RESOURCE_CONTEXT, ResourceData} from "./Resource";
import Utils from "../util/Utils";

const ctx = {
    "files": {
        "@id": "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/ma-soubor",
        "@container": "@set"
    }
};

export const CONTEXT = Object.assign({}, RESOURCE_CONTEXT, ctx, FILE_CONTEXT);

export interface DocumentData extends ResourceData {
    files: File[],
}

export default class Document extends Resource implements DocumentData {
    public files: File[];

    constructor(data: DocumentData) {
        super(data);
        this.files = Utils.sanitizeArray(data.files);
    }

    public toJsonLd(): {} {
        return Object.assign({}, this, {"@context": CONTEXT, "@type": [OntologicalVocabulary.DOCUMENT]});
    }
}

export const EMPTY_DOCUMENT = new Document({
    iri: "http://empty",
    label: "",
    terms: [],
    files: []
});


