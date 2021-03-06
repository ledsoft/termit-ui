import OntologicalVocabulary from "../util/VocabularyUtils";
import VocabularyUtils from "../util/VocabularyUtils";
import Asset, {ASSET_CONTEXT, AssetData} from "./Asset";
import Document, {CONTEXT as DOCUMENT_CONTEXT} from "./Document";
import WithUnmappedProperties from "./WithUnmappedProperties";
import Utils from "../util/Utils";
import Constants from "../util/Constants";

// @id and @type are merged from ASSET_CONTEXT
const ctx = {
    "label": VocabularyUtils.DC_TITLE,
    "comment": VocabularyUtils.DC_DESCRIPTION,
    "document": VocabularyUtils.PREFIX + "popisuje-dokument",
    "glossary": VocabularyUtils.PREFIX + "má-glosář",
    "model": VocabularyUtils.PREFIX + "má-model",
    "importedVocabularies": VocabularyUtils.IMPORTS_VOCABULARY
};

export const CONTEXT = Object.assign({}, ASSET_CONTEXT, DOCUMENT_CONTEXT, ctx);

const MAPPED_PROPERTIES = ["@context", "iri", "label", "comment", "document", "types", "glossary", "model", "importedVocabularies", "allImportedVocabularies"];

export interface VocabularyData extends AssetData {
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
    iri: Constants.EMPTY_ASSET_IRI,
    label: ""
});
