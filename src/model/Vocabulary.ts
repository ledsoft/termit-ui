import {CONTEXT as USER_CONTEXT} from "./User";
import OntologicalVocabulary from "../util/VocabularyUtils";
import VocabularyUtils from "../util/VocabularyUtils";
import Asset, {ASSET_CONTEXT, AssetData, HasProvenanceData, PROVENANCE_CONTEXT} from "./Asset";
import Document, {CONTEXT as DOCUMENT_CONTEXT} from "./Document";
import WithUnmappedProperties from "./WithUnmappedProperties";
import Utils from "../util/Utils";

// @id and @type are merged from ASSET_CONTEXT
const ctx = {
    "label": VocabularyUtils.RDFS_LABEL,
    "document": VocabularyUtils.PREFIX + "popisuje-dokument",
    "glossary": VocabularyUtils.PREFIX + "má-glosář",
    "model": VocabularyUtils.PREFIX + "má-model",
    "importedVocabularies": VocabularyUtils.IMPORTS_VOCABULARY
};

export const CONTEXT = Object.assign(ctx, ASSET_CONTEXT, PROVENANCE_CONTEXT, USER_CONTEXT, DOCUMENT_CONTEXT);

const MAPPED_PROPERTIES = ["@context", "iri", "label", "comment", "created", "author", "lastEditor", "lastModified", "document", "types", "glossary", "model", "importedVocabularies", "allImportedVocabularies"];

export interface VocabularyData extends AssetData, HasProvenanceData {
    label: string;
    document?: Document;
    glossary?: AssetData;
    model?: AssetData;
    importedVocabularies?: AssetData[];
}

export default class Vocabulary extends Asset implements VocabularyData {
    public label: string;
    public document?: Document;
    public glossary?: AssetData;
    public model?: AssetData;
    public importedVocabularies?: AssetData[];
    public allImportedVocabularies?: string[];

    constructor(data: VocabularyData) {
        super();
        Object.assign(this, data);
        this.initUserData(data);
        this.types = Utils.sanitizeArray(data.types);
        if (this.types.indexOf(OntologicalVocabulary.VOCABULARY) === -1) {
            this.types.push(OntologicalVocabulary.VOCABULARY);
        }
    }

    public toJsonLd(): VocabularyData {
        const result = Object.assign({}, this, {"@context": CONTEXT});
        delete result.allImportedVocabularies;
        return result;
    }

    public get unmappedProperties(): Map<string, string[]> {
        return WithUnmappedProperties.getUnmappedProperties(this, MAPPED_PROPERTIES);
    }

    public set unmappedProperties(properties: Map<string, string[]>) {
        WithUnmappedProperties.setUnmappedProperties(this, properties, MAPPED_PROPERTIES);
    }
}

export const EMPTY_VOCABULARY = new Vocabulary({
    iri: "http://empty",
    label: "",
    created: Date.now()
});
