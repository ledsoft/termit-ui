export const CONTEXT = {
    "name": "http://www.w3.org/2000/01/rdf-schema#label",
    "iri": "@id"
};

export default class Vocabulary {
    public name: string;
    public iri?: string;

    constructor(data: { name: string, iri: string }) {
        Object.assign(this, data);
    }

    public toJsonLd(): {} {
        return Object.assign({}, this, {"@context": CONTEXT});
    }
}