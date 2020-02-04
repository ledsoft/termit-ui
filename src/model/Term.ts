import {ASSET_CONTEXT, AssetData, default as Asset, HasProvenanceData, PROVENANCE_CONTEXT} from "./Asset";
import Utils from "../util/Utils";
import WithUnmappedProperties from "./WithUnmappedProperties";
import {CONTEXT as USER_CONTEXT} from "./User";
import VocabularyUtils from "../util/VocabularyUtils";
import * as _ from "lodash";

const ctx = {
    label: VocabularyUtils.SKOS_PREF_LABEL,
    definition: VocabularyUtils.DEFINITION,
    parentTerms: VocabularyUtils.BROADER,
    subTerms: VocabularyUtils.NARROWER,
    sources: "http://purl.org/dc/terms/source",
    vocabulary: VocabularyUtils.IS_TERM_FROM_VOCABULARY,
    types: "@type"
};

export const CONTEXT = Object.assign(ctx, ASSET_CONTEXT, PROVENANCE_CONTEXT, USER_CONTEXT);

const MAPPED_PROPERTIES = ["@context", "iri", "label", "comment", "definition", "created", "author", "lastEditor", "lastModified",
    "subTerms", "sources", "types", "parentTerms", "parent", "plainSubTerms", "vocabulary"];

export interface TermData extends AssetData, HasProvenanceData {
    label: string;
    definition?: string;
    subTerms?: TermInfo[];
    sources?: string[];
    // Represents proper parent Term, stripped of broader terms representing other model relationships
    parentTerms?: TermData[];
    parent?: string;    // Introduced in order to support the Intelligent Tree Select component
    plainSubTerms?: string[];   // Introduced in order to support the Intelligent Tree Select component
    vocabulary?: AssetData;
}

export interface TermInfo {
    iri: string;
    label: string;
    vocabulary: AssetData;
}

export default class Term extends Asset implements TermData {
    public definition?: string;
    public subTerms?: TermInfo[];
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
        if (this.parentTerms) {
            this.parentTerms = Utils.sanitizeArray(this.parentTerms).map(pt => new Term(pt));
            this.parentTerms.sort(Utils.labelComparator);
            this.parent = this.resolveParent(this.parentTerms);
        }
        if (this.subTerms) {
            // jsonld replaces single-element arrays with singular elements, which we don't want here
            this.subTerms = Utils.sanitizeArray(this.subTerms);
        }
        this.syncPlainSubTerms();
    }

    private resolveParent(parents: Term[]) {
        const sameVocabulary = parents.find(t => _.isEqual(t.vocabulary, this.vocabulary));
        if (sameVocabulary) {
            return sameVocabulary.iri;
        }
        return undefined;
    }

    /**
     * Synchronizes the value of plainSubTerms with subTerms.
     */
    public syncPlainSubTerms() {
        if (this.subTerms) {
            this.plainSubTerms = Utils.sanitizeArray(this.subTerms).map(st => st.iri);
        } else {
            this.plainSubTerms = undefined;
        }
    }

    public toTermData(): TermData {
        const result: any = Object.assign({}, this);
        if (result.parentTerms) {
            result.parentTerms = result.parentTerms.map((pt: Term) => pt.toTermData());
        }
        delete result.subTerms; // Sub-terms are inferred and inconsequential for data upload to server
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
