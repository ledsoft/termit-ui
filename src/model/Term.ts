import {ASSET_CONTEXT, AssetData, default as Asset, HasProvenanceData, PROVENANCE_CONTEXT} from "./Asset";
import Utils from "../util/Utils";
import WithUnmappedProperties from "./WithUnmappedProperties";
import {CONTEXT as USER_CONTEXT} from "./User";
import VocabularyUtils from "../util/VocabularyUtils";

const ctx = {
    definition: VocabularyUtils.DEFINITION,
    subTerms: VocabularyUtils.NARROWER,
    sources: "http://purl.org/dc/elements/1.1/source",
    vocabulary: VocabularyUtils.JE_POJMEM_ZE_SLOVNIKU,
    types: "@type"
};

export const CONTEXT = Object.assign(ctx, ASSET_CONTEXT, PROVENANCE_CONTEXT, USER_CONTEXT);

const MAPPED_PROPERTIES = ["@context", "iri", "label", "comment", "definition", "created", "author", "lastEditor", "lastModified",
    "subTerms", "sources", "types", "parent", "plainSubTerms", "vocabulary"];

export interface TermData extends AssetData, HasProvenanceData {
    label: string;
    definition?: string;
    subTerms?: AssetData[];
    sources?: string[];
    parent?: string;
    plainSubTerms?: string[];   // Introduced in order to support the Intelligent Tree Select component
    vocabulary?: AssetData;
}

export default class Term extends Asset implements TermData {
    public definition?: string;
    public subTerms?: AssetData[];
    public parent?: string;
    public sources?: string[];
    public plainSubTerms?: string[];
    public readonly vocabulary?: AssetData;

    constructor(termData: TermData) {
        super();
        Object.assign(this, termData);
        this.initUserData(termData);
        this.types = Utils.sanitizeArray(termData.types);
        if (this.types.indexOf(VocabularyUtils.TERM) === -1) {
            this.types.push(VocabularyUtils.TERM);
        }
        if (this.subTerms) {
            this.subTerms = Utils.sanitizeArray(this.subTerms);
            this.plainSubTerms = Utils.sanitizeArray(this.subTerms).map(st => st.iri!);
        }
    }

    public toTermData(): TermData {
        const result: any = {};
        Object.assign(result, this);
        delete result.plainSubTerms;
        return result;
    }

    public get unmappedProperties(): Map<string, string[]> {
        return WithUnmappedProperties.getUnmappedProperties(this, MAPPED_PROPERTIES);
    }

    public set unmappedProperties(properties: Map<string, string[]>) {
        WithUnmappedProperties.setUnmappedProperties(this, properties, MAPPED_PROPERTIES);
    }

    public toJsonLd(): TermData {
        const termData = this.toTermData();
        Object.assign(termData, {"@context": CONTEXT});
        return termData;
    }
}