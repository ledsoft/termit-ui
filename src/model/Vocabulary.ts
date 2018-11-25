import User, {CONTEXT as USER_CONTEXT, UserData} from "./User";
import OntologicalVocabulary from '../util/VocabularyUtils';
import Asset, {AssetData} from "./Asset";
import WithUnmappedProperties from "./WithUnmappedProperties";

const ctx = {
    "label": "http://www.w3.org/2000/01/rdf-schema#label",
    "iri": "@id",
    "created": "http://purl.org/dc/terms/created",
    "author": "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/ma-autora",
    "document": "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/popisuje-dokument"
};

export const CONTEXT = Object.assign(ctx, USER_CONTEXT);

const MAPPED_PROPERTIES = ['@context', 'iri', 'label', "created", "author", "document"];

export interface VocabularyData extends AssetData {
    label: string,
    author?: UserData,
    created?: number
    document?: { iri: string }
}

export default class Vocabulary extends Asset implements VocabularyData {
    public label: string;
    public author?: User;
    public created?: number;
    public document?: { iri: string };

    constructor(data: VocabularyData) {
        super();
        Object.assign(this, data);
        if (data.author) {
            this.author = new User(data.author);
        }
    }

    public toJsonLd(): {} {
        return Object.assign({}, this, {"@context": CONTEXT, "@type": [OntologicalVocabulary.VOCABULARY]});
    }

    public get unmappedProperties(): Map<string, string[]> {
        return WithUnmappedProperties.getUnmappedProperties(this, MAPPED_PROPERTIES);
    }

    public set unmappedProperties(properties: Map<string, string[]>) {
        WithUnmappedProperties.setUnmappedProperties(this, properties);
    }
}

export const EMPTY_VOCABULARY = new Vocabulary({
    iri: 'http://empty',
    label: ''
});