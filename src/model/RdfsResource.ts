import {AssetData} from "./Asset";

export const CONTEXT = {
    iri: '@id',
    label: "http://www.w3.org/2000/01/rdf-schema#label",
    comment: "http://www.w3.org/2000/01/rdf-schema#comment"
};

/**
 * Represents a generic RDFS resource.
 */
export default interface RdfsResource extends AssetData {
    readonly iri: string;
    readonly label?: string;
    readonly comment?: string;
}