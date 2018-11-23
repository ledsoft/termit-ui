import {AssetData} from "./Asset";

export const CONTEXT = {
    iri: '@id',
    label: "http://www.w3.org/2000/01/rdf-schema#label",
    comment: "http://www.w3.org/2000/01/rdf-schema#comment"
};

export interface RdfsResourceData extends AssetData {
    iri: string;
    label?: string;
    comment?: string;
}

/**
 * Represents a generic RDFS resource.
 */
export default class RdfsResource implements RdfsResourceData {
    public readonly iri: string;
    public readonly label?: string;
    public readonly comment?: string;

    constructor(data: RdfsResourceData) {
        Object.assign(this, data);
    }

    public toJsonLd() {
        return Object.assign({}, this, {"@context": CONTEXT});
    }
}