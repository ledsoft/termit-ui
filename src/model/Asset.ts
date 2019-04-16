import User, {UserData} from "./User";
import OntologicalVocabulary from "../util/VocabularyUtils";

export interface AssetData {
    iri?: string;
    label?: string;
    comment?: string;
    types?: string[] | string;
}

/**
 * JSON-LD context definition for asset data.
 */
export const ASSET_CONTEXT = {
    iri: "@id",
    label: OntologicalVocabulary.RDFS_LABEL,
    comment: OntologicalVocabulary.RDFS_COMMENT,
    types: "@type"
};

export interface HasProvenanceData {
    author?: UserData;
    created?: number;
    lastEditor?: UserData;
    lastModified?: number;
}

/**
 * JSON-LD context definition for provenance data.
 */
export const PROVENANCE_CONTEXT = {
    author: OntologicalVocabulary.HAS_AUTHOR,
    created: OntologicalVocabulary.CREATED,
    lastEditor: OntologicalVocabulary.HAS_LAST_EDITOR,
    lastModified: OntologicalVocabulary.LAST_MODIFIED
};

export default abstract class Asset implements AssetData, HasProvenanceData {
    public iri: string;
    public label: string;
    public comment?: string;
    public author?: User;
    public created?: number;
    public lastEditor?: User;
    public lastModified?: number;
    public types?: string[];

    protected initUserData(data: HasProvenanceData) {
        if (data.author) {
            this.author = new User(data.author);
        }
        if (data.lastEditor) {
            this.lastEditor = new User(data.lastEditor);
        }
    }

    public get lastEdited(): number | undefined {
        return this.lastModified ? this.lastModified : this.created;
    }

    public get lastEditedBy(): User | undefined {
        return this.lastEditor ? this.lastEditor : this.author;
    }

    public addType(type: string) {
        if (!this.types) {
            this.types = [];
        }
        if (this.types.indexOf(type) === -1) {
            this.types.push(type);
        }
    }

    public abstract toJsonLd(): {};
}
