import User, {CONTEXT as USER_CONTEXT, UserData} from "./User";
import OntologicalVocabulary from '../util/VocabularyUtils';
import Asset, {AssetData} from "./Asset";
import WithUnmappedProperties from "./WithUnmappedProperties";
import Utils from "../util/Utils";

// @id and @type are merged from USER_CONTEXT
const ctx = {
    "label": "http://www.w3.org/2000/01/rdf-schema#label",
    "comment": "http://www.w3.org/2000/01/rdf-schema#comment",
    "created": "http://purl.org/dc/terms/created",
    "author": "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/ma-autora",
    "document": "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/popisuje-dokument",
    "glossary": "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/ma-glosar",
    "model": "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/ma-model"
};

export const CONTEXT = Object.assign(ctx, USER_CONTEXT);

const MAPPED_PROPERTIES = ['@context', 'iri', 'label', "created", "author", "document", "types", "glossary", "model"];

export interface VocabularyData extends AssetData {
    label: string;
    comment?: string;
    author?: UserData;
    created?: number;
    document?: { iri: string };
    glossary?: AssetData;
    model?: AssetData;
    types?: string[];
}

export default class Vocabulary extends Asset implements VocabularyData {
    public label: string;
    public comment: string;
    public author?: User;
    public created?: number;
    public document?: { iri: string };
    public glossary?: AssetData;
    public model?: AssetData;
    public types?: string[];

    constructor(data: VocabularyData) {
        super();
        Object.assign(this, data);
        if (data.author) {
            this.author = new User(data.author);
        }
    }

    public toJsonLd(): VocabularyData {
        const result = Object.assign({}, this, {
            "@context": CONTEXT,
            types: Utils.sanitizeArray(this.types)
        });
        if (result.types.indexOf(OntologicalVocabulary.VOCABULARY) === -1) {
            result.types.push(OntologicalVocabulary.VOCABULARY);
        }
        return result;
    }

    public get unmappedProperties(): Map<string, string[]> {
        return WithUnmappedProperties.getUnmappedProperties(this, MAPPED_PROPERTIES);
    }

    public set unmappedProperties(properties: Map<string, string[]>) {
        WithUnmappedProperties.setUnmappedProperties(this, properties, MAPPED_PROPERTIES);
    }
}

export const EMPTY_VOCABULARY = new Vocabulary({
    iri: 'http://empty',
    label: ''
});