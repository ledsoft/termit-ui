import {ASSET_CONTEXT, AssetData, default as Asset, HasProvenanceData, PROVENANCE_CONTEXT} from "./Asset";
import Utils from "../util/Utils";
import WithUnmappedProperties from "./WithUnmappedProperties";
import {CONTEXT as USER_CONTEXT} from "./User";

const ctx = {
    subTerms: "http://www.w3.org/2004/02/skos/core#narrower",
    sources: "http://purl.org/dc/elements/1.1/source",
    vocabulary: "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/je-pojmem-ze-slovniku",
    types: "@type"
};

export const CONTEXT = Object.assign(ctx, ASSET_CONTEXT, PROVENANCE_CONTEXT, USER_CONTEXT);

const MAPPED_PROPERTIES = ["@context", "iri", "label", "comment", "created", "author", "lastEditor", "lastModified", "subTerms", "sources", "types", "parent", "plainSubTerms", "vocabulary"];

export interface TermData extends AssetData, HasProvenanceData {
    label: string;
    subTerms?: AssetData[];
    sources?: string[];
    types?: string[];
    parent?: string;
    plainSubTerms?: string[];   // Introduced in order to support the Intelligent Tree Select component
    vocabulary?: AssetData;
}

export default class Term extends Asset implements TermData {
    public subTerms?: AssetData[];
    public parent?: string;
    public types?: string[];
    public sources?: string[];
    public plainSubTerms?: string[];
    public readonly vocabulary?: AssetData;

    constructor(termData: TermData) {
        super(termData);
        Object.assign(this, termData);
        this.types = Utils.sanitizeArray(termData.types);
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