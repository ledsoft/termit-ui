import {CONTEXT as RESOURCE_CONTEXT, ResourceData} from "./Resource";
import {AssetData} from "./Asset";
import Utils from "../util/Utils";

const ctx = {
    vocabularies: "http://onto.fel.cvut.cz/ontologies/application/termit/pojem/m\u00e1-slovn\u00edk-pro-anal\u00fdzu",
    analyzedResource: "http://onto.fel.cvut.cz/ontologies/application/termit/pojem/m\u00e1-analyzovan\u00fd-zdroj"
};

export const CONTEXT = Object.assign({}, ctx, RESOURCE_CONTEXT);

export interface TextAnalysisRecordData {
    iri: string;
    analyzedResource: ResourceData;
    vocabularies: AssetData[];
    created: number;
}

export class TextAnalysisRecord implements TextAnalysisRecordData {
    public readonly iri: string;
    public readonly analyzedResource: ResourceData;
    public readonly vocabularies: AssetData[];
    public readonly created: number;

    constructor(data: TextAnalysisRecordData) {
        Object.assign(this, data);
        this.vocabularies = Utils.sanitizeArray(data.vocabularies);
    }
}