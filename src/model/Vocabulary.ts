import User, {CONTEXT as USER_CONTEXT} from "./User";
import OntologicalVocabulary from "../util/VocabularyUtils";
import Asset, {ASSET_CONTEXT, AssetData, HasProvenanceData, PROVENANCE_CONTEXT} from "./Asset";
import WithUnmappedProperties from "./WithUnmappedProperties";
import Utils from "../util/Utils";

// @id and @type are merged from USER_CONTEXT
const ctx = {
    "document": "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/popisuje-dokument",
    "glossary": "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/ma-glosar",
    "model": "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/ma-model"
};

export const CONTEXT = Object.assign(ctx, ASSET_CONTEXT, PROVENANCE_CONTEXT, USER_CONTEXT);

const MAPPED_PROPERTIES = ["@context", "iri", "label", "comment", "created", "author", "lastEditor", "lastModified", "document", "types", "glossary", "model"];

export interface VocabularyData extends AssetData, HasProvenanceData {
    label: string;
    document?: { iri: string };
    glossary?: AssetData;
    model?: AssetData;
}

export default class Vocabulary extends Asset implements VocabularyData {
    public label: string;
    public document?: { iri: string };
    public glossary?: AssetData;
    public model?: AssetData;

    constructor(data: VocabularyData) {
        super(data);
        Object.assign(this, data);
        if (data.author) {
            this.author = new User(data.author);
        }
    }

    public toJsonLd(): VocabularyData {
        const result = Object.assign({}, this, {
            "@context": CONTEXT,
            types: Utils.sanitizeArray(this.types)
        });
        if (result.types.indexOf(OntologicalVocabulary.VOCABULARY) === -1) {
            result.types.push(OntologicalVocabulary.VOCABULARY);
        }
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