import OntologicalVocabulary from "../util/VocabularyUtils";
import VocabularyUtils from "../util/VocabularyUtils";
import File, {OWN_CONTEXT as FILE_CONTEXT, FileData} from "./File";
import Resource, {CONTEXT as RESOURCE_CONTEXT, ResourceData} from "./Resource";
import Utils from "../util/Utils";
import {AssetData} from "./Asset";

const ctx = {
    "files": {
        "@id": VocabularyUtils.HAS_FILE,
        "@container": "@set"
    },
    "vocabulary": "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/má-dokumentový-slovník"
};

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
        const result: any = Object.assign({}, this, {
            "@context": CONTEXT,
            types: [OntologicalVocabulary.RESOURCE, OntologicalVocabulary.DOCUMENT]
        });
        // Break reference cycles by replacing them with ID-references only
        result.files = Document.replaceCircularReferencesToOwnerWithOwnerId(result.files);
        return result;
    }

    public static replaceCircularReferencesToOwnerWithOwnerId(files: File[]): FileData[] {
        return files.map(f => Object.assign({}, f, {owner: f.owner ? {iri: f.owner.iri} : undefined}));
    }
}
