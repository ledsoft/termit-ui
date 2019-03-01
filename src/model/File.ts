import OntologicalVocabulary from "../util/VocabularyUtils";
import Resource, {CONTEXT as RESOURCE_CONTEXT, ResourceData} from "./Resource";

const ctx = {
    "content": "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/soubor/content",
    "document": "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/je-casti-dokumentu"
};

export const CONTEXT = Object.assign({}, RESOURCE_CONTEXT, ctx);

export interface FileData extends ResourceData {
    origin?: string,
    content?: string
}

export default class File extends Resource implements FileData {
    public origin: string;
    public content?: string;

    constructor(data: FileData) {
        super(data);
        this.origin = data.origin ? data.origin : "";
        this.content = data.content;
    }

    public clone() {
        return new File(this);
    }

    public toJsonLd(): {} {
        return Object.assign({}, this, {"@context": RESOURCE_CONTEXT, "@type": [OntologicalVocabulary.FILE]});
    }
}

export const EMPTY_FILE = new File({
    iri: "http://empty",
    label: "",
    terms: []
});