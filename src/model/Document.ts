import OntologicalVocabulary from "../util/VocabularyUtils";
import File, {CONTEXT as FILE_CONTEXT} from "./File";
import Resource, {CONTEXT as RESOURCE_CONTEXT, ResourceData} from "./Resource";
import Utils from "../util/Utils";
import {AssetData} from "./Asset";
import VocabularyUtils from "../util/VocabularyUtils";

const ctx = {
    "files": {
        "@id": VocabularyUtils.HAS_FILE,
        "@container": "@set"
    },
    "vocabulary": "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/má-dokumentový-slovník"
};

export const OWN_CONTEXT = Object.assign({}, RESOURCE_CONTEXT, ctx);

export const CONTEXT = Object.assign({}, RESOURCE_CONTEXT, ctx, FILE_CONTEXT);

export interface DocumentData extends ResourceData {
    files: File[];
    vocabulary?: AssetData;
}

export default class Document extends Resource implements DocumentData {
    public files: File[];
    public vocabulary?: AssetData;

    constructor(data: DocumentData) {
        super(data);
        this.files = Utils.sanitizeArray(data.files).map(fd => new File(fd));
    }

    public clone() {
        return new Document(this);
    }

    public toJsonLd(): {} {
        return Object.assign({}, this, {"@context": CONTEXT, "@type": [OntologicalVocabulary.DOCUMENT]});
    }
}
