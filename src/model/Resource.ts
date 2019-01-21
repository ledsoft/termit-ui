import Asset, {ASSET_CONTEXT, AssetData, HasProvenanceData, PROVENANCE_CONTEXT} from "./Asset";
import Term from "./Term";
import {CONTEXT as USER_CONTEXT} from "./User";
import Utils from "../util/Utils";
import VocabularyUtils from "../util/VocabularyUtils";

const ctx = {
    description: "http://purl.org/dc/elements/1.1/description"
};

export const CONTEXT = Object.assign(ctx, ASSET_CONTEXT, PROVENANCE_CONTEXT, USER_CONTEXT);

export interface ResourceData extends AssetData, HasProvenanceData {
    iri: string,
    label: string,
    description?: string,
    terms?: Term[]
}

export default class Resource extends Asset implements ResourceData {
    public description?: string;
    public terms: Term[];

    constructor(data: ResourceData) {
        super(data);
        this.terms = [];
        Object.assign(this, data);
        this.types = Utils.sanitizeArray(data.types);
        if (this.types.indexOf(VocabularyUtils.RESOURCE) === -1) {
            this.types.push(VocabularyUtils.RESOURCE);
        }
    }

    public toJsonLd(): {} {
        return Object.assign({}, this, {"@context": CONTEXT});
    }
}

export const EMPTY_RESOURCE = new Resource({
    iri: "http://empty",
    label: "",
    terms: []
});