import {ASSET_CONTEXT, AssetData, default as Asset, HasProvenanceData, PROVENANCE_CONTEXT} from "./Asset";
import Utils from "../util/Utils";
import WithUnmappedProperties from "./WithUnmappedProperties";
import {CONTEXT as USER_CONTEXT} from "./User";
import VocabularyUtils from "../util/VocabularyUtils";
import * as _ from "lodash";

const ctx = {
    definition: VocabularyUtils.DEFINITION,
    parentTerms: VocabularyUtils.BROADER,
    subTerms: VocabularyUtils.NARROWER,
    sources: "http://purl.org/dc/elements/1.1/source",
    vocabulary: VocabularyUtils.JE_POJMEM_ZE_SLOVNIKU,
    types: "@type"
};

export const CONTEXT = Object.assign(ctx, ASSET_CONTEXT, PROVENANCE_CONTEXT, USER_CONTEXT);

const MAPPED_PROPERTIES = ["@context", "iri", "label", "comment", "definition", "created", "author", "lastEditor", "lastModified",
    "subTerms", "sources", "types", "parentTerms", "parent", "plainSubTerms", "vocabulary"];

export interface TermData extends AssetData, HasProvenanceData {
    label: string;
    definition?: string;
    subTerms?: AssetData[];
    sources?: string[];
    // Represents proper parent Term, stripped of broader terms representing other model relationships
    parentTerms?: TermData[];
    parent?: string;    // Introduced in order to support the Intelligent Tree Select component
    plainSubTerms?: string[];   // Introduced in order to support the Intelligent Tree Select component
    vocabulary?: AssetData;
}

export default class Term extends Asset implements TermData {
    public definition?: string;
    public subTerms?: AssetData[];
    public parentTerms?: Term[];
    public readonly parent?: string;
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
            this.plainSubTerms = this.subTerms.map(st => st.iri!);
        }
        if (this.parentTerms) {
            this.parentTerms = Utils.sanitizeArray(this.parentTerms).map(pt => new Term(pt));
            this.parent = this.resolveParent(this.parentTerms);
        }
    }

    private resolveParent(parents: Term[]) {
        const sameVocabulary = parents.find(t => _.isEqual(t.vocabulary, this.vocabulary));
        if (sameVocabulary) {
            return sameVocabulary.iri;
        }
        return undefined;
    }

    public toTermData(): TermData {
        const result: any = Object.assign({}, this);
        if (result.parentTerms) {
            result.parentTerms = result.parentTerms.map((pt: Term) => pt.toTermData());
        }
        if (result.subTerms) {
            // Prevent circular references possibly introduced by resolving references when deserializing JSON-LD on
            // load
            result.subTerms = Utils.sanitizeArray(result.subTerms).map((st: AssetData) => ({iri: st.iri}));
        }
        delete result.plainSubTerms;
        delete result.parent;
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