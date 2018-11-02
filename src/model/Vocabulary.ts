import User, {CONTEXT as USER_CONTEXT, UserData} from "./User";
import VocabularyUtils from '../util/VocabularyUtils';
import Asset, {AssetData} from "./Asset";
import Utils from "../util/Utils";

const ctx = {
    "label": "http://www.w3.org/2000/01/rdf-schema#label",
    "iri": "@id",
    "types": "@type",
    "created": "http://purl.org/dc/terms/created",
    "author": "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/ma-autora",
    "document": "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/popisuje-dokument"
};

export const CONTEXT = Object.assign(ctx, USER_CONTEXT);

export interface VocabularyData extends AssetData {
    label: string;
    author?: UserData;
    created?: number;
    document?: { iri: string };
    types?: string[];
}

export default class Vocabulary extends Asset implements VocabularyData {
    public label: string;
    public author?: User;
    public created?: number;
    public document?: { iri: string };
    public types: string[];

    constructor(data: VocabularyData) {
        super();
        Object.assign(this, data);
        if (data.author) {
            this.author = new User(data.author);
        }
        this.types = Utils.sanitizeArray(data.types);
        if (this.types.indexOf(VocabularyUtils.VOCABULARY) === -1) {
            this.types.push(VocabularyUtils.VOCABULARY);
        }
    }

    public toJsonLd(): VocabularyData {
        return Object.assign({}, this, {"@context": CONTEXT});
    }
}

export const EMPTY_VOCABULARY = new Vocabulary({
    iri: 'http://empty',
    label: ''
});