import Asset, {AssetData} from "./Asset";

const ctx = {
    "iri": "@id",
    "label": "http://www.w3.org/2000/01/rdf-schema#label",
    "comment": "http://www.w3.org/2000/01/rdf-schema#comment"
};

export const CONTEXT = Object.assign(ctx);

export interface ResourceData extends AssetData {
    iri: string,
    label: string,
    comment?: string
}

export default class Resource extends Asset implements ResourceData {
    public iri: string;
    public label: string;
    public comment?: string;

    constructor(data: ResourceData) {
        super();
        Object.assign(this, data);
    }

    public toJsonLd(): {} {
        return Object.assign({}, this, {"@context": CONTEXT});
    }
}

export const EMPTY_RESOURCE = new Resource({
    iri: 'http://empty',
    label: ''
});